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
      v-model="localValue"
      type="text"
      :placeholder="field.placeholder"
      @input="handleUpdate"
    />
    
    <!-- Number input -->
    <input
      v-else-if="field.type === 'number'"
      :id="field.id"
      v-model.number="localValue"
      type="number"
      :placeholder="field.placeholder"
      @input="handleUpdate"
    />
    
    <!-- Ontology search input -->
    <OntologySearchInput
      v-else-if="field.type === 'ontology-search'"
      :field="field"
      :value="localValue"
      @update="handleUpdate"
    />
    
    <!-- Composite fields (nested) -->
    <div v-else-if="field.type === 'composite'" class="composite-field">
      <FormField
        v-for="subfield in field.subfields"
        :key="subfield.id"
        :field="subfield"
        :value="localValue[subfield.id]"
        @update="handleCompositeUpdate(subfield.id, $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import OntologySearchInput from './OntologySearchInput.vue'

const props = defineProps({
  field: Object,
  value: [String, Number, Object]
})

const emit = defineEmits(['update'])

const localValue = ref(props.value || (props.field.type === 'composite' ? {} : ''))

watch(() => props.value, (newValue) => {
  localValue.value = newValue || (props.field.type === 'composite' ? {} : '')
})

const handleUpdate = () => {
  emit('update', localValue.value)
}

const handleCompositeUpdate = (subfieldId, value) => {
  localValue.value[subfieldId] = value
  emit('update', { ...localValue.value })
}
</script>