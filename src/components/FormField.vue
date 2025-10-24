<template>
  <div class="form-field" :class="{ required: field.required }">
    <label :for="field.id">
      {{ field.label }}
      <span v-if="field.required" class="required-indicator">*</span>
    </label>
    
    <p v-if="field.helpText" class="help-text">{{ field.helpText }}</p>
    
    <!-- Simple text input -->
    <input
      v-if="field.type === 'text'"
      :id="field.id"
      :value="modelValue"
      type="text"
      :placeholder="field.placeholder"
      @input="handleInput"
    />
    
    <!-- Number input -->
    <input
      v-else-if="field.type === 'number'"
      :id="field.id"
      :value="modelValue"
      type="number"
      :placeholder="field.placeholder"
      @input="handleInput"
    />
    
    <!-- Ontology search input -->
    <OntologySearchInput
      v-else-if="field.type === 'ontology-search'"
      :field="field"
      :model-value="modelValue"
      @update:model-value="handleUpdate"
    />
    
    <!-- Composite fields (nested) -->
    <div v-else-if="field.type === 'composite'" class="composite-field">
      <FormField
        v-for="subfield in field.subfields"
        :key="subfield.id"
        :field="subfield"
        :model-value="modelValue?.[subfield.id] || ''"
        @update:model-value="handleCompositeUpdate(subfield.id, $event)"
      />
    </div>
  </div>
</template>

<script setup>
import OntologySearchInput from './OntologySearchInput.vue'

const props = defineProps({
  field: Object,
  modelValue: [String, Number, Object]
})

const emit = defineEmits(['update:model-value'])

const handleInput = (event) => {
  const value = props.field.type === 'number' 
    ? parseFloat(event.target.value) 
    : event.target.value
  emit('update:model-value', value)
}

const handleUpdate = (value) => {
  emit('update:model-value', value)
}

const handleCompositeUpdate = (subfieldId, value) => {
  const newValue = { ...(props.modelValue || {}) }
  newValue[subfieldId] = value
  emit('update:model-value', newValue)
}
</script>

<style scoped>
.form-field {
  margin-bottom: 20px;
}

.form-field.required label {
  font-weight: 600;
}

.required-indicator {
  color: #f44336;
  margin-left: 4px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.help-text {
  font-size: 12px;
  color: #666;
  margin: -4px 0 8px 0;
  font-style: italic;
}

input[type="text"],
input[type="number"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.composite-field {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.composite-field .form-field {
  margin-bottom: 15px;
}

.composite-field .form-field:last-child {
  margin-bottom: 0;
}
</style>