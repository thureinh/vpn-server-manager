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
        <VPNDashboard class="mb-3" />
        <CADashboard />
    </div>
</template>