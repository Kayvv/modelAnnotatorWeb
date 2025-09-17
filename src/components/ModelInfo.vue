<template>
  <div class="model-info">
    <h4>Model Info</h4>
    <p><strong>Name:</strong> {{ model.name() || 'No name' }}</p>
    <p><strong>Components:</strong> {{ components.length }}</p>
  </div>
</template>

<script setup>
defineProps({
  model: Object,
  components: Array
})
</script>