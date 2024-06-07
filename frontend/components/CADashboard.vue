<script setup lang="js">
    const serverStatus = ref('stopped')
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

    const statusClass = computed(() => ({
        'font-bold': true,
        'text-green-600': serverStatus.value === 'running',
        'text-red-600': serverStatus.value === 'error',
        'text-yellow-600': serverStatus.value === 'starting' || serverStatus.value === 'stopping',
        'text-blue-600': serverStatus.value === 'stopped',
        'text-purple-600': serverStatus.value === 'pending',
    }))
    
    const startVpnServer = () => changeVpnServerState('/api/ca/start', 'running')
    const stopVpnServer = () => changeVpnServerState('/api/ca/stop', 'stopped')

    onMounted(() => {
        getServerStatus()
    })
</script>
<template>
    <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-gray-700 text-xl font-semibold mb-4">CA Server Control</h2>

        <!-- Buttons Section -->
        <div class="flex flex-wrap gap-4">
            <button
                @click="startVpnServer"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                Start VPN Server
            </button>
            <button
                @click="stopVpnServer"
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                Stop VPN Server
            </button>
            <button
                class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                Generate Client Certificate
            </button>
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
