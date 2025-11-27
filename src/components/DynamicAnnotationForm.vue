<template>
  <div class="dynamic-annotation-form">
    <div v-if="!selectedVariable.possibleOPBTerms || selectedVariable.possibleOPBTerms.length === 0" class="no-opb-message">
      <div class="info-message">
        <h4>⚠️ No OPB Terms Available</h4>
        <p>No physical property terms found for units "{{ selectedVariable.units }}".</p>
      </div>
    </div>

    <div v-else-if="!hasAnnotationType" class="opb-only-annotation">
      <div class="form-header">
        <h3>Physical Property Annotation</h3>
        <p>This variable only requires an OPB (Ontology of Physics for Biology) term.</p>
        <div class="auto-detected-info">
          <span class="info-badge category">{{ variableCategory }}</span>
          <span class="info-badge domain">{{ selectedVariable.domain }}</span>
          <span class="info-badge units">Units: {{ selectedVariable.units }}</span>
        </div>
      </div>

      <div class="form-body">
        <div class="form-field opb-field">
          <label for="opb-term">
            Physical Property (OPB)
            <span class="required-indicator">*</span>
          </label>
          <p class="help-text">The physical property that this variable represents</p>
          
          <div v-if="selectedVariable.possibleOPBTerms.length === 1" class="single-opb-container">
            <input
              id="opb-term"
              v-model="opbTerm"
              type="text"
              class="opb-input auto-filled"
              placeholder="e.g., OPB:00425"
            />
            <span class="auto-filled-badge">✓ Auto-filled</span>
          </div>

          <div v-else class="multiple-opb-container">
            <input
              id="opb-term"
              v-model="opbTerm"
              type="text"
              class="opb-input"
              placeholder="e.g., OPB:00425"
            />
            <div class="opb-suggestions">
              <p class="suggestions-label">⚠️ Multiple options available - please select one:</p>
              <div class="opb-buttons">
                <button
                  v-for="term in selectedVariable.possibleOPBTerms"
                  :key="term"
                  type="button"
                  @click="selectOPBTerm(term)"
                  class="opb-suggestion-btn"
                  :class="{ selected: opbTerm === term }"
                >
                  <span class="term-id">{{ term }}</span>
                  <span class="term-label">{{ getOPBTermLabel(term) }}</span>
                </button>
              </div>
            </div>
          </div>

          <a 
            v-if="opbTerm"
            :href="`http://identifiers.org/opb/${opbTerm.replace(':', '_')}`"
            target="_blank"
            class="search-link"
            title="View in OPB browser"
          >
            🔍 View in OPB
          </a>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="saveOPBAnnotation" class="btn btn-primary">
          Save Annotation
        </button>
      </div>

      <div v-if="opbError" class="validation-errors">
        <p>{{ opbError }}</p>
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
import { ontologyCommonTerms } from '../config/ontologyCommonTerms'
import FormField from './FormField.vue'

const props = defineProps({
  selectedVariable: Object,
  variableCategory: String,
  userOntologies: Object
})

const emit = defineEmits(['annotation-added'])

const formData = ref({})
const validationErrors = ref([])
const opbTerm = ref('')
const opbError = ref('')

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

const getOPBTermLabel = (termId) => {
  const opbTerms = ontologyCommonTerms.OPB?.terms || []
  const term = opbTerms.find(t => t.id === termId)
  return term ? term.label : ''
}

const selectOPBTerm = (term) => {
  opbTerm.value = term
  opbError.value = ''
}

const saveOPBAnnotation = () => {
  opbError.value = ''
  
  if (!opbTerm.value) {
    opbError.value = 'Please enter or select an OPB term'
    return
  }
  
  if (!/^OPB:\d+$/.test(opbTerm.value)) {
    opbError.value = 'Invalid OPB term format (expected: OPB:####)'
    return
  }
  
  const annotation = {
    type: 'OPB-only',
    domain: props.selectedVariable?.domain || 'General',
    qualifier: 'bqbiol:isPropertyOf',
    data: {
      physicalProperty: opbTerm.value
    },
    variable: props.selectedVariable
  }
  
  console.log('Saving OPB-only annotation:', annotation)
  emit('annotation-added', annotation)
}

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
      if (field.id === 'physicalProperty' && props.selectedVariable?.possibleOPBTerms) {
        const terms = props.selectedVariable.possibleOPBTerms
        if (terms.length === 1) {
          data[field.id] = terms[0]
          console.log(`Auto-filled OPB term: ${terms[0]}`)
        } else {
          data[field.id] = field.defaultValue || ''
        }
      } else {
        data[field.id] = field.defaultValue || ''
      }
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

// Auto-fill OPB term for OPB-only variables
watch(() => props.selectedVariable, (newVar) => {
  if (newVar && newVar.possibleOPBTerms && newVar.possibleOPBTerms.length > 0) {
    if (newVar.possibleOPBTerms.length === 1) {
      opbTerm.value = newVar.possibleOPBTerms[0]
    } else {
      opbTerm.value = ''
    }
  } else {
    opbTerm.value = ''
  }
  opbError.value = ''
}, { immediate: true })

watch(() => props.selectedVariable, () => {
  if (hasAnnotationType.value) {
    initializeFormData()
  }
  validationErrors.value = []
}, { immediate: true })

onMounted(() => {
  if (hasAnnotationType.value) {
    initializeFormData()
  }
})
</script>

<style scoped>
/* Layout */
.dynamic-annotation-form {
  padding: 20px;
}

.opb-only-annotation,
.annotation-form-content {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
}

/* Form Header */
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


/* Form Fields */
.form-body {
  margin-bottom: 20px;
}

.opb-field {
  margin-bottom: 20px;
}

.form-field label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

.required-indicator {
  color: #f44336;
  margin-left: 4px;
}

.help-text {
  font-size: 12px;
  color: #666;
  margin: -4px 0 8px 0;
  font-style: italic;
}

/* OPB Input */
.single-opb-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.multiple-opb-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.opb-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: 'Courier New', monospace;
  transition: border-color 0.3s ease;
}

.opb-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.opb-input.auto-filled {
  background: #e8f5e9;
  border-color: #4CAF50;
}

/* OPB Suggestions */
.opb-suggestions {
  padding: 15px;
  background: #fff3e0;
  border-left: 4px solid #ff9800;
  border-radius: 4px;
}

.suggestions-label {
  margin: 0 0 10px 0;
  color: #e65100;
  font-size: 14px;
  font-weight: 500;
}

.opb-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.opb-suggestion-btn {
  padding: 12px 16px;
  background: white;
  border: 2px solid #ff9800;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.opb-suggestion-btn:hover {
  background: #fff8e1;
  border-color: #f57c00;
}

.opb-suggestion-btn.selected {
  background: #ff9800;
  color: white;
  border-color: #f57c00;
}

.term-id {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  font-weight: 600;
}

.term-label {
  font-size: 11px;
  opacity: 0.8;
  font-family: 'Segoe UI', sans-serif;
}

.opb-suggestion-btn.selected .term-label {
  opacity: 1;
}

/* Success Indicator */
.selected-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: #e8f5e9;
  border-radius: 4px;
  margin-top: 10px;
}

.success-icon {
  color: #4CAF50;
  font-size: 18px;
  font-weight: bold;
}

.success-text {
  color: #2e7d32;
  font-size: 14px;
  font-weight: 500;
}

/* Links & Buttons */
.search-link {
  display: inline-block;
  margin-top: 8px;
  padding: 6px 12px;
  background: #2196F3;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 12px;
  transition: background-color 0.3s ease;
}

.search-link:hover {
  background: #1976D2;
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

/* Validation Errors */
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

.validation-errors p {
  margin: 0;
  color: #c62828;
  font-size: 14px;
}

.validation-errors ul {
  margin: 0;
  padding-left: 20px;
}

.validation-errors li {
  color: #c62828;
  margin-bottom: 5px;
}

/* Messages */
.no-opb-message,
.no-annotation-needed {
  padding: 30px;
  text-align: center;
}

.info-message {
  background: #fff3e0;
  border: 2px solid #ff9800;
  border-radius: 8px;
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;
}

.info-message h4 {
  margin: 0 0 15px 0;
  color: #e65100;
  font-size: 20px;
}

.info-message p {
  margin: 10px 0;
  color: #e65100;
  line-height: 1.6;
}

.info-message ul {
  text-align: left;
  margin: 15px 0;
  padding-left: 30px;
}

.info-message li {
  margin: 8px 0;
}

/* Badges */
.auto-detected-info {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.info-badge {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
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

.auto-filled-badge {
  padding: 6px 12px;
  background: #4CAF50;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>