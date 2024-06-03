<script setup>
    definePageMeta({
        middleware: 'auth',
    })
    const navButtonState = inject('navButtonState')
    const pageTitle = inject('pageTitle')

    pageTitle.value = 'Member Page'
    navButtonState.value = 'showMemberForm'
</script>
<template>
    <div>
        <MemberForm v-show="navButtonState === 'showMemberList'" />
        <MemberList v-show="navButtonState === 'showMemberForm'" />
    </div>
</template>