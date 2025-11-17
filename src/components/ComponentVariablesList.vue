<template>
  <div>
    <h4>Variables by Component</h4>
    <div class="components-scroll-container">
      <div class="components-container">
        <div 
          v-for="(componentData, componentName) in groupedVariables" 
          :key="componentName"
          class="component-group"
        >
          <!-- Component Header -->
          <div 
            class="component-header"
            @click="toggleComponent(componentName)"
          >
            <div class="component-info-row">
              <span class="component-name">{{ componentName }}</span>
              <span class="variable-count">({{ componentData.totalVariables }} vars)</span>
              <span class="annotation-badge" :class="getAnnotationStatus(componentData)">
                {{ componentData.needsAnnotation > 0 
                   ? `${getAnnotatedCount(componentName)}/${componentData.needsAnnotation}` 
                   : '✓' }}
              </span>
              <span class="toggle-icon" :class="{ expanded: expandedComponents[componentName] }">
                ▼
              </span>
            </div>
          </div>
          
          <!-- Categories within Component -->
          <div v-show="expandedComponents[componentName]" class="categories-container">
          <div 
            v-for="(variables, categoryName) in componentData.categories" 
            :key="categoryName"
            class="category-group"
          >
            <div 
              class="category-header"
              @click="toggleCategory(componentName, categoryName)"
            >
              <div class="category-title">
                <span class="category-name">{{ categoryName }}</span>
                <span class="category-count">({{ variables.length }})</span>
                <span 
                  v-if="needsAnnotationInCategory(variables)"
                  class="annotation-indicator"
                  :class="getCategoryAnnotationStatus(componentName, categoryName, variables)"
                >
                  {{ getCategoryAnnotationText(componentName, categoryName, variables) }}
                </span>
              </div>
              <span 
                class="toggle-icon" 
                :class="{ expanded: expandedCategories[`${componentName}-${categoryName}`] }"
              >
                ▼
              </span>
            </div>
            
            <!-- Variables List -->
            <div 
              v-show="expandedCategories[`${componentName}-${categoryName}`]" 
              class="variables-list"
            >
              <div 
                v-for="variable in variables" 
                :key="`${variable.component.name}-${variable.name}`"
                class="variable-item"
                :class="{ 
                  selected: selectedVariable === variable,
                  annotated: isVariableAnnotated(variable),
                  'needs-annotation': variable.annotationType
                }"
                @click="$emit('variable-selected', variable)"
              >
                <div class="variable-info">
                  <div class="variable-header">
                    <strong class="variable-name">{{ variable.name }}</strong>
                    <span 
                      v-if="variable.annotationType" 
                      class="annotation-status"
                      :class="{ annotated: isVariableAnnotated(variable) }"
                    >
                      {{ isVariableAnnotated(variable) ? '✓' : '⚠️' }}
                    </span>
                  </div>
                  <div class="variable-details">
                    <span class="variable-units">
                      Units: {{ variable.units }}
                    </span>
                    <span v-if="variable.initialValue" class="initial-value">
                      Initial: {{ variable.initialValue }}
                    </span>
                    <span v-if="variable.annotationType" class="annotation-type">
                      Type: {{ variable.annotationType }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  groupedVariables: Object,
  selectedVariable: Object,
  annotations: Object  
})

const emit = defineEmits(['variable-selected'])

const expandedComponents = ref({})
const expandedCategories = ref({})

const initializeExpandedState = () => {
  Object.keys(props.groupedVariables || {}).forEach(componentName => {
    if (!(componentName in expandedComponents.value)) {
      expandedComponents.value[componentName] = true
    }
    
    Object.keys(props.groupedVariables[componentName].categories).forEach(categoryName => {
      const key = `${componentName}-${categoryName}`
      if (!(key in expandedCategories.value)) {
        expandedCategories.value[key] = true
      }
    })
  })
}

watch(() => props.groupedVariables, () => {
  initializeExpandedState()
}, { immediate: true })

const toggleComponent = (componentName) => {
  expandedComponents.value[componentName] = !expandedComponents.value[componentName]
}

const toggleCategory = (componentName, categoryName) => {
  const key = `${componentName}-${categoryName}`
  expandedCategories.value[key] = !expandedCategories.value[key]
}

const getVariableKey = (variable) => {
  return `${variable.component.name}.${variable.name}`
}

const isVariableAnnotated = (variable) => {
  if (!props.annotations) return false
  const key = getVariableKey(variable)
  return props.annotations[key] && props.annotations[key].length > 0
}

const getAnnotatedCount = (componentName) => {
  const componentData = props.groupedVariables[componentName]
  if (!componentData) return 0
  
  let count = 0
  Object.values(componentData.categories).forEach(variables => {
    variables.forEach(variable => {
      if (variable.annotationType && isVariableAnnotated(variable)) {
        count++
      }
    })
  })
  return count
}

const getAnnotationStatus = (componentData) => {
  if (componentData.needsAnnotation === 0) return 'no-annotation-needed'
  
  const annotated = getAnnotatedCount(componentData.name)
  if (annotated === 0) return 'not-annotated'
  if (annotated === componentData.needsAnnotation) return 'fully-annotated'
  return 'partially-annotated'
}

const needsAnnotationInCategory = (variables) => {
  return variables.some(v => v.annotationType)
}

const getCategoryAnnotationStatus = (componentName, categoryName, variables) => {
  const needsAnnotation = variables.filter(v => v.annotationType)
  if (needsAnnotation.length === 0) return ''
  
  const annotated = needsAnnotation.filter(v => isVariableAnnotated(v))
  
  if (annotated.length === 0) return 'not-annotated'
  if (annotated.length === needsAnnotation.length) return 'fully-annotated'
  return 'partially-annotated'
}

const getCategoryAnnotationText = (componentName, categoryName, variables) => {
  const needsAnnotation = variables.filter(v => v.annotationType)
  if (needsAnnotation.length === 0) return ''
  
  const annotated = needsAnnotation.filter(v => isVariableAnnotated(v))
  
  if (annotated.length === 0) return '⚠️ Not annotated'
  if (annotated.length === needsAnnotation.length) return '✓ Complete'
  return `${annotated.length}/${needsAnnotation.length}`
}
</script>

<style scoped>
.components-scroll-container {
  max-height: 650px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.components-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.components-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.components-scroll-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.components-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.components-container {
  border-radius: 8px;
  overflow: visible;
}

.component-group {
  border-bottom: 2px solid #e0e0e0;
}

.component-group:last-child {
  border-bottom: none;
}

.component-header {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.3s;
  position: sticky;
  top: 0;
  z-index: 20;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.component-header:hover {
  background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.component-info-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.component-name {
  font-weight: bold;
  font-size: 15px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  flex-shrink: 0;
}

.variable-count {
  font-size: 12px;
  opacity: 0.9;
  flex-shrink: 0;
}

.annotation-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  text-shadow: 0 1px 1px rgba(0,0,0,0.2);
  margin-left: auto;
  flex-shrink: 0;
}

.annotation-badge.no-annotation-needed {
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.annotation-badge.not-annotated {
  background: #ff6f00;
  animation: pulse-badge 2s ease-in-out infinite;
}

.annotation-badge.partially-annotated {
  background: #ffa000;
}

.annotation-badge.fully-annotated {
  background: #2e7d32;
}

@keyframes pulse-badge {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.toggle-icon {
  transition: transform 0.2s;
  color: rgba(255, 255, 255, 0.9);
  font-size: 10px;
  flex-shrink: 0;
}

.category-header .toggle-icon {
  color: #666;
}

.toggle-icon.expanded {
  transform: rotate(180deg);
}

.categories-container {
  background: #fafafa;
  padding: 8px;
}

.category-group {
  background: white;
  border-radius: 6px;
  margin-bottom: 6px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.category-group:last-child {
  margin-bottom: 0;
}

.category-header {
  background: #f8f9fa;
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.category-header:hover {
  background: #e9ecef;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 6px;
}

.category-name {
  font-weight: bold;
  color: #2196f3;
  font-size: 13px;
}

.category-count {
  color: #666;
  font-size: 12px;
}

.annotation-indicator {
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
}

.annotation-indicator.not-annotated {
  background: #ffebee;
  color: #c62828;
}

.annotation-indicator.partially-annotated {
  background: #fff3e0;
  color: #e65100;
}

.annotation-indicator.fully-annotated {
  background: #e8f5e9;
  color: #2e7d32;
}

.variables-list {
  background: white;
}

.variable-item {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.variable-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: transparent;
  transition: background 0.2s;
}

.variable-item.needs-annotation:not(.annotated)::before {
  background: #ff9800;
}

.variable-item.annotated::before {
  background: #4CAF50;
}

.variable-item:hover {
  background-color: #f8f9fa;
}

.variable-item.selected {
  background-color: #e3f2fd;
}

.variable-item:last-child {
  border-bottom: none;
}

.variable-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 3px;
}

.variable-name {
  color: #333;
  font-size: 13px;
}

.annotation-status {
  font-size: 13px;
}

.annotation-status.annotated {
  color: #4CAF50;
}

.variable-details {
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-size: 11px;
  color: #666;
}

.variable-units {
  color: #4caf50;
}

.initial-value {
  color: #ff9800;
}

.annotation-type {
  color: #2196f3;
  font-weight: 500;
}
</style>

