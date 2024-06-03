<script setup>
    definePageMeta({
        middleware: 'auth',
    })
    const navButtonState = inject('navButtonState')
    const pageTitle = inject('pageTitle')

    pageTitle.value = 'Main Page'
    navButtonState.value = ''
</script>
<template>
    <div>
        <Dashboard />
    </div>
</template>