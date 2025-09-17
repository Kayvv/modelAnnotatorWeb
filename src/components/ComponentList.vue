<template>
  <div>
    <h4>Component List</h4>
    <div class="components-list">
      <div 
        v-for="(component, index) in components" 
        :key="index"
        class="component-item"
        :class="{ selected: selectedComponent === component }"
        @click="$emit('component-selected', component)"
      >
        <strong>{{ component.name }}</strong>
        <div style="font-size: 12px; color: #666;">
          Number of variables: {{ component.variableCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  components: Array,
  selectedComponent: Object
})

defineEmits(['component-selected'])
</script>