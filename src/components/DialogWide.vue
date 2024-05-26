<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
    default: false
  }
})
</script>

<template>
  <div class="dialog w-full h-full bg-black bg-opacity-65 fixed flex right-0 left-0 top-0 bottom-0" v-show="props.show">
    <div class="w-3/4 h-3/4 bg-white m-auto p-10">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

</style>