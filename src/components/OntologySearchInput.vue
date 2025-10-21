<template>
  <div class="ontology-search-input">
    <div class="input-with-button">
      <input
        v-model="localValue"
        type="text"
        :placeholder="field.placeholder"
        @input="handleInput"
        @blur="validateFormat"
      />
      <a 
        v-if="field.searchUrl && localValue" 
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
      <button @click="showCommonTerms = !showCommonTerms" class="toggle-common">
        {{ showCommonTerms ? 'Hide' : 'Show' }} common terms
      </button>
      <div v-show="showCommonTerms" class="terms-list">
        <button
          v-for="term in field.commonTerms"
          :key="term.id"
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
import { ref, watch } from 'vue'

const props = defineProps({
  field: Object,
  value: String
})

const emit = defineEmits(['update'])

const localValue = ref(props.value || '')
const showCommonTerms = ref(false)
const formatError = ref('')

watch(() => props.value, (newValue) => {
  localValue.value = newValue || ''
})

const handleInput = () => {
  formatError.value = ''
  emit('update', localValue.value)
}

const validateFormat = () => {
  if (localValue.value && props.field.validatePattern) {
    if (!props.field.validatePattern.test(localValue.value)) {
      formatError.value = `Invalid format for ${props.field.ontology} term`
    }
  }
}

const selectTerm = (term) => {
  localValue.value = term.id
  showCommonTerms.value = false
  emit('update', term.id)
}

const getSearchUrl = () => {
  return props.field.searchUrl + localValue.value
}
</script>