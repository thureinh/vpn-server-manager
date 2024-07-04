<script setup>
    const {
        signOut
    } = useAuth()
    const route = useRoute()
</script>
<template>
    <nav class="bg-gray-800 p-4">
        <div class="flex flex-col md:flex-row justify-start justify-between items-center">
            <a href="/" class="text-2xl font-bold text-white">VPN Server Management System</a>

            <div v-if="route.path !== '/login'"  class="flex md:justify items-center space-x-4 mt-3 md:mt-0">
                <button @click="navigateTo({ path: '/' })" class="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-full">
                    Servers
                </button>
                <button @click="navigateTo({ path: '/member' })" disabled class="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-full cursor-not-allowed opacity-50">
                    Members
                </button>
                <button @click="signOut({ callbackUrl: '/login' })"
                    class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-full">
                    Logout
                </button>
            </div>
        </div>
    </nav>
</template>
