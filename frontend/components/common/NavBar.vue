<script setup>
    const {
        signOut
    } = useAuth()
    const route = useRoute()
</script>
<template>
    <nav class="bg-gray-800 p-4">
        <div class="flex justify-between items-center">
            <a href="/" class="text-2xl font-bold text-white">VPN Server Management System</a>

            <div v-if="route.path !== '/login'"  class="flex justify-end items-center space-x-4">
                <button @click="navigateTo({ path: '/' })" class="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-full">
                    Servers
                </button>
                <button @click="navigateTo({ path: '/member' })" class="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-full">
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
