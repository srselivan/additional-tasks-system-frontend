<script setup>
const props = defineProps(['title'])
</script>

<template>
  <h4 class="block font-sans text-2xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
    {{ props.title }}
  </h4>
</template>

<style scoped>

</style>