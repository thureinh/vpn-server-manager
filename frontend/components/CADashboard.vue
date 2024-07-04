<script setup lang="js">
const serverStatus = ref('stopped')
const clientName = ref('')
const scriptStatus = ref('Idle')
let intervalId = null
const getServerStatus = async () => {
    try {
        const response = await $fetch('/api/ca/status')
        serverStatus.value = response.state
    } catch (error) {
        console.error(error)
        serverStatus.value = 'error'
    }
}
const changeCaServerState = async (apiEndpoint, expectedStatus) => {
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

const generateCertificate = async () => {
    if (!clientName.value.trim()) {
        console.error('clientName value cannot be empty')
        return
    }
    scriptStatus.value = 'Pending'
    try {
        const response = await $fetch('/api/ca/generate-cert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clientName: clientName.value }),
        })
        const checkInterval = setInterval(async () => {
            const statusResponse = await $fetch('/api/ca/check-output', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ commandId: response.commandId }),
            })
            if (statusResponse.status.toUpperCase() !== 'PENDING') {
                clearInterval(checkInterval)
                scriptStatus.value = statusResponse.status
            }
        }, 3000)
    } catch (error) {
        console.error(error)
        scriptStatus.value = 'Failed'
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

const startCaServer = () => changeCaServerState('/api/ca/start', 'running')
const stopCaServer = () => changeCaServerState('/api/ca/stop', 'stopped')

onMounted(() => {
    getServerStatus()
})
</script>
<template>
    <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-gray-700 text-xl font-semibold mb-4">CA Server Control</h2>

        <!-- Buttons Section -->
        <div class="flex flex-col md:flex-row items-center gap-4">
            <button @click="startCaServer"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                Start CA Server
            </button>
            <button @click="stopCaServer"
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                Stop CA Server
            </button>
            <section class="my-4 p-4 bg-gray-200 rounded md:ml-4">
                <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    <input
                        v-model="clientName"
                        class="shadow bg-black appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                        type="text" placeholder="Enter client name">
                    <button
                        @click="generateCertificate"
                        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 w-full md:w-auto">
                        Generate Certificate
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
            </section>
        </div>

        <!-- Status Section -->
        <div class="mt-6">
            <h3 class="text-gray-700 text-lg font-medium">Server Status:</h3>
            <p class="text-gray-600 mt-2">The CA server is currently
                <span :class="statusClass">
                    {{ serverStatus }}
                </span>.
            </p>
        </div>
    </div>
</template>
