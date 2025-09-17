<template>
  <div v-if="message.text" :class="message.type">
    {{ message.text }}
  </div>
</template>

<script setup>
defineProps({
  message: Object
})
</script>