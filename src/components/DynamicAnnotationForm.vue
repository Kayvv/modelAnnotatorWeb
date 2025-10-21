<template>
  <div class="dynamic-annotation-form">
    <div v-if="!selectedTemplate" class="template-selector">
      <h3>Annotation Type</h3>
      <p class="category-info">
        Variable category: <strong>{{ variableCategory }}</strong>
      </p>
      <p class="units-info">
        Units: <strong>{{ selectedVariable.units }}</strong>
      </p>
      
      <div class="template-options">
        <div 
          v-for="(template, key) in availableTemplates" 
          :key="key"
          class="template-card"
          @click="selectTemplate(key)"
        >
          <h4>{{ template.displayName }}</h4>
          <p>{{ template.description }}</p>
        </div>
      </div>
    </div>

    <div v-else class="annotation-form-content">
      <!-- Header with template info -->
      <div class="form-header">
        <button @click="resetTemplate" class="back-button">← Back</button>
        <h3>{{ currentTemplate.displayName }}</h3>
        <p>{{ currentTemplate.description }}</p>
      </div>

      <!-- Dynamic form fields -->
      <div class="form-body">
        <FormField
          v-for="field in currentTemplate.fields"
          :key="field.id"
          :field="field"
          :value="formData[field.id]"
          @update="updateField(field.id, $event)"
        />
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button @click="validateAndSubmit" class="btn btn-primary">
          Add Annotation
        </button>
        <button @click="resetForm" class="btn btn-secondary">
          Clear Form
        </button>
      </div>

      <!-- Validation messages -->
      <div v-if="validationErrors.length" class="validation-errors">
        <h4>Please fix the following errors:</h4>
        <ul>
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { getTemplatesForDomain } from '../config/annotationFormTemplates'
import FormField from './FormField.vue'

const props = defineProps({
  selectedVariable: Object,
  variableCategory: String
})

const emit = defineEmits(['annotation-added'])

const selectedTemplate = ref(null)
const formData = ref({})
const validationErrors = ref([])

// Determine which templates are appropriate for this variable
const availableTemplates = computed(() => {
  const domain = props.selectedVariable?.domain || 'Unknown'
  
  console.log('Variable domain:', domain)
  
  if (domain === 'Unknown') {
    return {
      ...getTemplatesForDomain('Biochemistry')
    }
  }
  
  return getTemplatesForDomain(domain)
})

const currentTemplate = computed(() => {
  return selectedTemplate.value 
    ? availableTemplates.value[selectedTemplate.value]
    : null
})

const selectTemplate = (templateKey) => {
  selectedTemplate.value = templateKey
  initializeFormData()
}

const resetTemplate = () => {
  selectedTemplate.value = null
  formData.value = {}
  validationErrors.value = []
}

const initializeFormData = () => {
  const template = currentTemplate.value
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
}

const updateField = (fieldId, value) => {
  formData.value[fieldId] = value
}

const validateAndSubmit = () => {
  validationErrors.value = []
  const template = currentTemplate.value
  
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
    
    // Validate patterns
    if (field.validatePattern && formData.value[field.id]) {
      if (field.type === 'composite') {
        field.subfields.forEach(subfield => {
          const value = formData.value[field.id]?.[subfield.id]
          if (value && subfield.validatePattern && !subfield.validatePattern.test(value)) {
            validationErrors.value.push(
              `${field.label} - ${subfield.label} has invalid format`
            )
          }
        })
      } else {
        if (!field.validatePattern.test(formData.value[field.id])) {
          validationErrors.value.push(`${field.label} has invalid format`)
        }
      }
    }
  })
  
  if (validationErrors.value.length === 0) {
    // Build annotation object
    const annotation = {
      type: selectedTemplate.value,
      qualifier: template.qualifier,
      data: { ...formData.value },
      variable: props.selectedVariable
    }
    
    emit('annotation-added', annotation)
    resetForm()
  }
}

const resetForm = () => {
  initializeFormData()
  validationErrors.value = []
}

// Watch for variable changes
watch(() => props.selectedVariable, () => {
  resetTemplate()
})
</script>