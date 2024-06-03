<script setup>
    const pageTitle = ref('Main Page')
    const buttonState = ref('')

    const route = useRoute()

    provide('pageTitle', pageTitle)
    provide('navButtonState', buttonState)

    const toggleButtonState = () => {
        if (route.path === "/member") {
            buttonState.value =
                buttonState.value === "showMemberForm" ? "showMemberList" : "showMemberForm"
        }
        if (route.path === "/") {
            buttonState.value =
                buttonState.value === "showTaskForm" ? "showTaskList" : "showTaskForm"
        }
    };

    const buttonNameFormatter = (str) => {
        return str
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, function(str){ return str.toUpperCase(); })
            .trim()
    }
</script>
<template>
    <div class="h-screen bg-white">
        <CommonNavBar />
        <header class="shadow">
            <div class="mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 class="text-3xl font-bold tracking-tight text-gray-900">
                    {{ pageTitle }}
                </h1>
                <button v-if="route.path !== '/login' && buttonState !== '' " @click="toggleButtonState"
                    class="flex items-center bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                    <svg class="h-6 w-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                    </svg>
                    {{ buttonNameFormatter(buttonState) }}
                </button>
            </div>
        </header>
        <main>
            <div class="py-6 sm:px-6 lg:px-8 bg-gray-100">
                <slot></slot>
            </div>
        </main>
    </div>
</template>
