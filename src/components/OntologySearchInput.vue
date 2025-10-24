<template>
  <div class="ontology-search-input">
    <div class="input-with-button">
      <input
        :value="modelValue"
        type="text"
        :placeholder="field.placeholder"
        @input="handleInput"
        @blur="validateFormat"
      />
      <a 
        v-if="field.searchUrl && modelValue" 
        :href="getSearchUrl()"
        target="_blank"
        class="search-link"
        title="Search in ontology database"
      >
        🔍
      </a>
    </div>
    
    <!-- Common terms dropdown -->
    <div v-if="field.commonTerms" class="common-terms">
      <button 
        type="button"
        @click="showCommonTerms = !showCommonTerms" 
        class="toggle-common"
      >
        {{ showCommonTerms ? 'Hide' : 'Show' }} common terms
      </button>
      <div v-show="showCommonTerms" class="terms-list">
        <button
          v-for="term in field.commonTerms"
          :key="term.id"
          type="button"
          @click="selectTerm(term)"
          class="term-button"
        >
          {{ term.id }} - {{ term.label }}
        </button>
      </div>
    </div>
    
    <!-- Format validation -->
    <p v-if="formatError" class="format-error">
      {{ formatError }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  field: Object,
  modelValue: String
})

const emit = defineEmits(['update:model-value'])

const showCommonTerms = ref(false)
const formatError = ref('')

const handleInput = (event) => {
  formatError.value = ''
  emit('update:model-value', event.target.value)
}

const validateFormat = () => {
  if (props.modelValue && props.field.validatePattern) {
    // Check if validatePattern is a RegExp
    if (props.field.validatePattern instanceof RegExp) {
      if (!props.field.validatePattern.test(props.modelValue)) {
        formatError.value = `Invalid format for ${props.field.ontology} term (expected: ${props.field.validatePattern.source})`
      }
    } else {
      console.warn('validatePattern is not a RegExp:', props.field.validatePattern)
      formatError.value = `Invalid format for ${props.field.ontology} term`
    }
  }
}

const selectTerm = (term) => {
  emit('update:model-value', term.id)
  showCommonTerms.value = false
  formatError.value = '' // Clear error when selecting from common terms
}

const getSearchUrl = () => {
  return props.field.searchUrl + props.modelValue
}
</script>

<style scoped>
.ontology-search-input {
  width: 100%;
}

.input-with-button {
  display: flex;
  gap: 8px;
  align-items: center;
}

.input-with-button input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.input-with-button input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.search-link {
  padding: 8px 12px;
  background: #2196F3;
  border-radius: 4px;
  text-decoration: none;
  font-size: 16px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
}

.search-link:hover {
  background: #1976D2;
}

.common-terms {
  margin-top: 10px;
}

.toggle-common {
  padding: 6px 12px;
  background: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 4px;
  color: #1976D2;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s ease;
}

.toggle-common:hover {
  background: #bbdefb;
}

.terms-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  background: #fafafa;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.term-button {
  padding: 8px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: left;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s ease;
}

.term-button:hover {
  background: #e8f5e9;
  border-color: #4CAF50;
  transform: translateX(4px);
}

.format-error {
  margin-top: 6px;
  font-size: 12px;
  color: #f44336;
}
</style>