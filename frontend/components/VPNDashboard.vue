<script setup lang="js">
const serverStatus = ref('stopped')
const scriptStatus = ref('Idle')
const clientName = ref('')
const downloadableUrl = ref('')
let intervalId = null
const getServerStatus = async () => {
    try {
        const response = await $fetch('/api/openvpn/status')
        serverStatus.value = response.state
    } catch (error) {
        console.error(error)
        serverStatus.value = 'error'
    }
}
const changeVpnServerState = async (apiEndpoint, expectedStatus) => {
    try {
        const response = await $fetch(apiEndpoint)
        serverStatus.value = response.state

        intervalId = setInterval(async () => {
            await getServerStatus()

            if (serverStatus.value === expectedStatus || serverStatus.value === 'error') {
                clearInterval(intervalId)
            }
        }, 10000)
    } catch (error) {
        console.error(error)
        serverStatus.value = 'error'
    }
}

const generateCsr = async () => {
    if (!clientName.value.trim()) {
        console.error('clientName value cannot be empty')
        return
    }
    scriptStatus.value = 'Pending'
    try {
        const { commandId } = await $fetch('/api/openvpn/generate-csr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clientName: clientName.value }),
        })
        const checkInterval = setInterval(async () => {
            scriptStatus.value = 'Pending'
            const statusResponse = await $fetch('/api/openvpn/check-output', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ commandId }),
            })
            if (statusResponse.status.toUpperCase() !== 'PENDING') {
                clearInterval(checkInterval)
                scriptStatus.value = statusResponse.status
            }
        }, 3000)
    } catch (error) {
        console.error(error)
    }
}

const extractS3Url = (output) => {
    const regex = /(s3:\/\/[a-zA-Z0-9-.]+\/[a-zA-Z0-9-.]+)/
    const match = output.match(regex)
    return match ? match[0] : null
}

const downloadConfigFile = async () => {
    try {
        scriptStatus.value = 'Pending'
        const { commandId } = await $fetch('/api/openvpn/download-config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clientName: clientName.value }),
        })

        const checkInterval = setInterval(async () => {
            const statusResponse = await $fetch('/api/openvpn/check-output', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ commandId }),
            })

            if (statusResponse.status.toUpperCase() !== 'PENDING') {
                clearInterval(checkInterval)
                scriptStatus.value = statusResponse.status
                const s3Url = extractS3Url(statusResponse.output)
                const urlResponse = await $fetch('/api/openvpn/get-signed-url', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ s3Url }),
                })
                downloadableUrl.value = urlResponse.s3Url
            }
        }, 3000)
    } catch (error) {
        console.error(error)
    }
}

const statusClass = computed(() => ({
    'font-bold': true,
    'text-green-600': serverStatus.value === 'running',
    'text-red-600': serverStatus.value === 'error',
    'text-yellow-600': serverStatus.value === 'starting' || serverStatus.value === 'stopping',
    'text-blue-600': serverStatus.value === 'stopped',
    'text-purple-600': serverStatus.value === 'pending',
}))

const startVpnServer = () => changeVpnServerState('/api/openvpn/start', 'running')
const stopVpnServer = () => changeVpnServerState('/api/openvpn/stop', 'stopped')

onMounted(() => {
    getServerStatus()
})
</script>
<template>
    <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-gray-700 text-xl font-semibold mb-4">VPN Server Control</h2>

        <!-- Buttons Section -->
        <div class="flex flex-col md:flex-row items-center gap-4">
            <button @click="startVpnServer"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                Start VPN Server
            </button>
            <button @click="stopVpnServer"
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                Stop VPN Server
            </button>
            <section class="my-4 p-4 bg-gray-200 rounded md:ml-4 w-11/12">
                <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    <input
                        v-model="clientName"
                        class="shadow bg-black appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                        type="text" placeholder="Enter client name">
                    <button
                        @click="generateCsr"
                        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 w-full md:w-auto">
                        Generate CSR
                    </button>
                    <button
                        @click="downloadConfigFile"
                        class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ml-0 w-full md:w-auto md:ml-4 mt-4 md:mt-0">
                        Download Config File
                    </button>
                </div>
                <div class="mt-4 flex items-center">
                    <span class="text-lg text-gray-700">Status:</span>
                    <span class="text-lg ml-2" :class="{
                        'text-green-500': scriptStatus.toUpperCase() === 'SUCCESS',
                        'text-red-500': scriptStatus.toUpperCase() === 'FAILED',
                        'text-yellow-500': scriptStatus.toUpperCase() === 'PENDING',
                        'text-blue-500': scriptStatus.toUpperCase() === 'IDLE'
                    }">
                        {{ scriptStatus }}
                    </span>
                </div>
                <div class="mt-6" v-show="downloadableUrl">
                    <h3 class="text-gray-700 text-lg font-medium">Downloadable URL:</h3>
                    <p class="text-gray-600 mt-2 overflow-x-auto">
                        <a :href="downloadableUrl" target="_blank" class="text-blue-500 underline">
                            Click here to download the config file within 5 minutes.
                        </a>
                    </p>
                </div>
            </section>
        </div>

        <!-- Status Section -->
        <div class="mt-6">
            <h3 class="text-gray-700 text-lg font-medium">Server Status:</h3>
            <p class="text-gray-600 mt-2">The VPN server is currently
                <span :class="statusClass">
                    {{ serverStatus }}
                </span>.
            </p>
        </div>
    </div>
</template>
