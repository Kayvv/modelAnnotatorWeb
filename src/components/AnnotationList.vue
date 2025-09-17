<template>
  <div>
    <h4>Current Annotations</h4>
    <div class="annotations-list">
      <div 
        v-for="(annotation, index) in annotations" 
        :key="index" 
        class="annotation-item"
      >
        <span class="annotation-key">{{ annotation.key }}:</span> 
        {{ annotation.value }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  annotations: Array
})
</script>