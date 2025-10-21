<template>
  <div class="term-selector">
    <div class="input-group">
      <input 
        v-model="searchQuery"
        @input="handleSearch"
        @focus="showDropdown = true"
        :placeholder="placeholder"
        class="term-input"
      />
      <a 
        v-if="ontologyUrl" 
        :href="ontologyUrl" 
        target="_blank"
        class="ontology-link"
        title="Search in ontology database"
      >
        🔍
      </a>
    </div>

    <!-- Dropdown for common terms -->
    <div v-if="showDropdown && filteredTerms.length > 0" class="terms-dropdown">
      <div class="dropdown-header">
        <span>Common Terms</span>
        <button @click="showDropdown = false" class="close-btn">×</button>
      </div>
      <div 
        v-for="term in filteredTerms" 
        :key="term.id"
        @click="selectTerm(term)"
        class="term-option"
      >
        <strong>{{ term.id }}</strong>: {{ term.label }}
        <div class="term-description">{{ term.description }}</div>
      </div>
    </div>

    <!-- Selected term display -->
    <div v-if="selectedTerm" class="selected-term">
      <span class="term-badge">
        {{ selectedTerm.id }}: {{ selectedTerm.label }}
      </span>
      <button @click="clearSelection" class="clear-btn">×</button>
    </div>

    <!-- Help text -->
    <div v-if="help" class="help-text">
      {{ help }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
// import { searchTerms, getTermDetails, commonTerms } from '../config/commonTerms'

const props = defineProps({
  modelValue: String,
  ontology: String,
  ontologyUrl: String,
  placeholder: String,
  help: String
})

const emit = defineEmits(['update:modelValue'])

const searchQuery = ref('')
const showDropdown = ref(false)
const selectedTerm = ref(null)

// Initialize from modelValue if provided
watch(() => props.modelValue, (newValue) => {
  if (newValue && !selectedTerm.value) {
    // Try to find term details
    const ontologyKey = getOntologyKey(props.ontology)
    // const details = getTermDetails(ontologyKey, newValue)
    if (details) {
      selectedTerm.value = details
      searchQuery.value = newValue
    } else {
      // Manual entry
      searchQuery.value = newValue
    }
  }
}, { immediate: true })

const filteredTerms = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    // Show all terms if no query
    const ontologyKey = getOntologyKey(props.ontology)
    // return commonTerms[ontologyKey]?.terms?.slice(0, 10) || []
  }
  
  const ontologyKey = getOntologyKey(props.ontology)
//   return searchTerms(ontologyKey, searchQuery.value)
})

const getOntologyKey = (ontologyName) => {
  // Map ontology names to commonTerms keys
  const mapping = {
    'ChEBI': 'ChEBI',
    'GO': 'GO_CellularComponent',
    'GO_process': 'GO_BiologicalProcess',
    'OPB': 'OPB',
    'FMA': 'FMA',
    'FMA/UBERON': 'FMA',
    'UniProt/PR': 'UniProt'
  }
  return mapping[ontologyName] || ontologyName
}

const handleSearch = () => {
  showDropdown.value = true
  // If user is typing manually, emit the value
  if (!selectedTerm.value) {
    emit('update:modelValue', searchQuery.value)
  }
}

const selectTerm = (term) => {
  selectedTerm.value = term
  searchQuery.value = term.id
  showDropdown.value = false
  emit('update:modelValue', term.id)
}

const clearSelection = () => {
  selectedTerm.value = null
  searchQuery.value = ''
  emit('update:modelValue', '')
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.term-selector')) {
    showDropdown.value = false
  }
}

// Add event listener on mount
import { onMounted, onUnmounted } from 'vue'
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.term-selector {
  position: relative;
  margin-bottom: 10px;
}

.input-group {
  display: flex;
  gap: 5px;
}

.term-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.term-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.ontology-link {
  padding: 8px 12px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-decoration: none;
  font-size: 16px;
  transition: background 0.2s;
}

.ontology-link:hover {
  background: #e0e0e0;
}

.terms-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-top: 4px;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
  font-size: 12px;
  color: #666;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 24px;
  height: 24px;
}

.close-btn:hover {
  color: #333;
}

.term-option {
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.term-option:hover {
  background: #f9f9f9;
}

.term-option:last-child {
  border-bottom: none;
}

.term-description {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.selected-term {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.term-badge {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  flex: 1;
}

.clear-btn {
  background: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0;
}

.clear-btn:hover {
  background: #d32f2f;
}

.help-text {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  font-style: italic;
}
</style>