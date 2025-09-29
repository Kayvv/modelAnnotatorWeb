<template>
  <div>
    <h4>Variable Groups List</h4>
    <div class="variables-container">
      <div 
        v-for="(variables, groupName) in groupedVariables" 
        :key="groupName"
        class="variable-group"
      >
        <div 
          class="group-header"
          @click="toggleGroup(groupName)"
        >
          <div class="group-title">
            <span class="group-name">{{ groupName }}</span>
            <span class="variable-count">({{ variables.length }})</span>
            <span class="toggle-icon" :class="{ expanded: expandedGroups[groupName] }">
              ▼
            </span>
          </div>
        </div>
        
        <div 
          v-show="expandedGroups[groupName]" 
          class="variables-list"
        >
          <div 
            v-for="(variable, index) in variables" 
            :key="`${variable.component.name}-${variable.name}`"
            class="variable-item"
            :class="{ selected: selectedVariable === variable }"
            @click="$emit('variable-selected', variable)"
          >
            <div class="variable-info">
              <strong class="variable-name">{{ variable.name }}</strong>
              <div class="variable-details">
                <span class="component-name">{{ variable.component.name }}</span>
                <span class="variable-units" v-if="variable.units">
                  Units: {{ variable.units }}
                </span>
                <span class="initial-value" v-if="variable.initialValue">
                  Initial: {{ variable.initialValue }}
                </span>
                <span class="interface-type" v-if="variable.interfaceType !== 'none'">
                  Interface: {{ variable.interfaceType }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  groupedVariables: Object,
  selectedVariable: Object
})

defineEmits(['variable-selected'])

const expandedGroups = ref({})

const initializeExpandedGroups = () => {
  Object.keys(props.groupedVariables || {}).forEach(groupName => {
    if (!(groupName in expandedGroups.value)) {
      expandedGroups.value[groupName] = true
    }
  })
}

onMounted(() => {
  initializeExpandedGroups()
})

watch(() => props.groupedVariables, () => {
  initializeExpandedGroups()
}, { immediate: true })

const toggleGroup = (groupName) => {
  expandedGroups.value[groupName] = !expandedGroups.value[groupName]
}
</script>