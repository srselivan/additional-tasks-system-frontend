<script setup>
defineProps({
  placeholder: {
    type: String,
    default: ""
  },
  modelValue: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    default: "text"
  }
})
</script>

<template>
  <input
      class="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent p-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-700 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
      :placeholder="placeholder"
      :value="modelValue"
      :type="type"
      @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<style scoped>

</style>