<template>
  <div class="dynamic-annotation-form">
    <div v-if="!hasAnnotationType" class="no-annotation-needed">
      <div class="info-message">
        <h4>ℹ️ No Semantic Annotation Required</h4>
        <p>Variables with units "{{ selectedVariable.units }}" ({{ variableCategory }}) typically don't require semantic annotations.</p>
        <p>This is usually used for:</p>
        <ul>
          <li v-if="variableCategory === 'Temporal'">Time measurements and temporal properties</li>
          <li v-if="variableCategory === 'Thermodynamic'">Basic thermodynamic properties</li>
          <li v-if="variableCategory === 'Quantities'">Geometric dimensions (length, area, mass)</li>
          <li v-if="variableCategory === 'Flow rates'">Velocity and kinematic properties</li>
        </ul>
      </div>
    </div>

    <div v-else class="annotation-form-content">
      <!-- Header with auto-detected info -->
      <div class="form-header">
        <h3>{{ formTemplate.displayName }}</h3>
        <p>{{ formTemplate.description }}</p>
        <div class="auto-detected-info">
          <span class="info-badge category">{{ selectedVariable.annotationType }}</span>
          <span class="info-badge domain">{{ selectedVariable.domain }}</span>
          <span class="info-badge units">Units: {{ selectedVariable.units }}</span>
        </div>
      </div>

      <!-- Dynamic form fields -->
      <div class="form-body">
        <FormField
          v-for="field in formTemplate.fields"
          :key="field.id"
          :field="field"
          :model-value="formData[field.id]"
          @update:model-value="updateField(field.id, $event)"
        />
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button type="button" @click="validateAndSubmit" class="btn btn-primary">
          Add Annotation
        </button>
        <button type="button" @click="resetForm" class="btn btn-secondary">
          Clear Form
        </button>
      </div>

      <!-- Validation messages -->
      <div v-if="validationErrors.length" class="validation-errors">
        <h4>Please fix the following errors:</h4>
        <ul>
          <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { getTemplateForVariable } from '../config/annotationFormTemplates'
import FormField from './FormField.vue'

const props = defineProps({
  selectedVariable: Object,
  variableCategory: String,
  userOntologies: Object
})

const emit = defineEmits(['annotation-added'])

const formData = ref({})
const validationErrors = ref([])

const hasAnnotationType = computed(() => {
  return props.selectedVariable?.annotationType !== null && 
         props.selectedVariable?.annotationType !== undefined
})

const formTemplate = computed(() => {
  if (!hasAnnotationType.value) {
    return null
  }
  
  const domain = props.selectedVariable?.domain || 'Biochemistry'
  const annotationType = props.selectedVariable?.annotationType
  
  console.log('Auto-selecting template for:', { domain, annotationType })
  
  // Pass userOntologies to inject common terms
  return getTemplateForVariable(domain, annotationType, props.userOntologies)
})

const initializeFormData = () => {
  const template = formTemplate.value
  if (!template) {
    console.error('No template found')
    return
  }
  
  const data = {}
  
  template.fields.forEach(field => {
    if (field.type === 'composite') {
      data[field.id] = {}
      field.subfields.forEach(subfield => {
        data[field.id][subfield.id] = subfield.defaultValue || ''
      })
    } else {
      data[field.id] = field.defaultValue || ''
    }
  })
  
  formData.value = data
  console.log('Initialized form data:', formData.value)
}

const updateField = (fieldId, value) => {
  console.log('Updating field:', fieldId, 'with value:', value)
  formData.value[fieldId] = value
}

const validateAndSubmit = () => {
  validationErrors.value = []
  const template = formTemplate.value
  
  if (!template) return
  
  console.log('Validating form data:', formData.value)
  
  // Validate all fields
  template.fields.forEach(field => {
    if (field.required) {
      if (field.type === 'composite') {
        field.subfields.forEach(subfield => {
          if (subfield.required && !formData.value[field.id]?.[subfield.id]) {
            validationErrors.value.push(
              `${field.label} - ${subfield.label} is required`
            )
          }
        })
      } else {
        if (!formData.value[field.id]) {
          validationErrors.value.push(`${field.label} is required`)
        }
      }
    }
    
    // Validate patterns - check if validatePattern exists and is a RegExp
    if (field.type === 'composite') {
      field.subfields.forEach(subfield => {
        const value = formData.value[field.id]?.[subfield.id]
        if (value && subfield.validatePattern) {
          // Ensure validatePattern is a RegExp object
          if (subfield.validatePattern instanceof RegExp) {
            if (!subfield.validatePattern.test(value)) {
              validationErrors.value.push(
                `${field.label} - ${subfield.label} has invalid format (expected pattern: ${subfield.validatePattern.source})`
              )
            }
          } else {
            console.warn(`validatePattern for ${subfield.label} is not a RegExp:`, subfield.validatePattern)
          }
        }
      })
    } else {
      const value = formData.value[field.id]
      if (value && field.validatePattern) {
        // Ensure validatePattern is a RegExp object
        if (field.validatePattern instanceof RegExp) {
          if (!field.validatePattern.test(value)) {
            validationErrors.value.push(
              `${field.label} has invalid format (expected pattern: ${field.validatePattern.source})`
            )
          }
        } else {
          console.warn(`validatePattern for ${field.label} is not a RegExp:`, field.validatePattern)
        }
      }
    }
  })
  
  if (validationErrors.value.length === 0) {
    // Build annotation object
    const annotation = {
      type: props.variableCategory,
      domain: props.selectedVariable?.domain,
      qualifier: template.qualifier,
      data: { ...formData.value },
      variable: props.selectedVariable
    }
    
    console.log('Submitting annotation:', annotation)
    emit('annotation-added', annotation)
    resetForm()
  } else {
    console.log('Validation errors:', validationErrors.value)
  }
}

const resetForm = () => {
  initializeFormData()
  validationErrors.value = []
}

// Watch for variable changes and reinitialize form
watch(() => props.selectedVariable, () => {
  initializeFormData()
  validationErrors.value = []
}, { immediate: true })

onMounted(() => {
  initializeFormData()
})
</script>

<style scoped>
.dynamic-annotation-form {
  padding: 20px;
}

.annotation-form-content {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
}

.form-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.form-header h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.form-header p {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
}

.auto-detected-info {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.info-badge {
  display: inline-block;
  padding: 6px 12px;
  background: #e3f2fd;
  color: #1976D2;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.form-body {
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #d0d0d0;
}

.validation-errors {
  margin-top: 20px;
  padding: 15px;
  background-color: #ffebee;
  border-left: 4px solid #f44336;
  border-radius: 4px;
}

.validation-errors h4 {
  margin: 0 0 10px 0;
  color: #c62828;
}

.validation-errors ul {
  margin: 0;
  padding-left: 20px;
}

.validation-errors li {
  color: #c62828;
  margin-bottom: 5px;
}

.no-annotation-needed {
  padding: 30px;
  text-align: center;
}

.info-message {
  background: #e8f5e9;
  border: 2px solid #4CAF50;
  border-radius: 8px;
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;
}

.info-message h4 {
  margin: 0 0 15px 0;
  color: #2e7d32;
  font-size: 20px;
}

.info-message p {
  margin: 10px 0;
  color: #1b5e20;
  line-height: 1.6;
}

.info-message ul {
  text-align: left;
  margin: 15px 0;
  padding-left: 30px;
  color: #2e7d32;
}

.info-message li {
  margin: 8px 0;
}

.info-badge.category {
  background: #fff3e0;
  color: #e65100;
}

.info-badge.domain {
  background: #e3f2fd;
  color: #1976D2;
}

.info-badge.units {
  background: #f3e5f5;
  color: #7b1fa2;
}
</style>