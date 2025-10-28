<template>
  <div class="ontology-selector-overlay" @click.self="handleOverlayClick">
    <div class="ontology-selector-modal">
      <!-- Close button -->
      <button class="close-button" @click="handleClose" title="Close">
        ✕
      </button>

      <!-- Step 1: Select Ontologies -->
      <div v-if="currentStep === 1" class="step-content">
        <div class="modal-header">
          <div class="step-indicator">
            <span class="step active">1</span>
            <span class="step-line"></span>
            <span class="step">2</span>
          </div>
          <h2>Step 1: Select Ontologies</h2>
          <p>Choose the ontologies you'll use for annotating this model.</p>
        </div>

        <div class="model-analysis" v-if="modelStats">
          <h3>Model Analysis</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Total Variables:</span>
              <span class="stat-value">{{ modelStats.totalVariables }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Biochemistry Variables:</span>
              <span class="stat-value">{{ modelStats.biochemistryCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Fluid Dynamics Variables:</span>
              <span class="stat-value">{{ modelStats.fluidDynamicsCount }}</span>
            </div>
          </div>
        </div>

        <div class="ontology-sections">
          <!-- Biochemistry Ontologies -->
          <div v-if="modelStats && modelStats.biochemistryCount > 0" class="ontology-section">
            <h3>
              <input 
                type="checkbox" 
                id="select-all-biochem"
                :checked="allBiochemSelected"
                @change="toggleAllBiochem"
              />
              <label for="select-all-biochem">Biochemistry Ontologies</label>
            </h3>
            <div class="ontology-list">
              <div 
                v-for="ontology in biochemistryOntologies" 
                :key="ontology.id"
                class="ontology-item"
                :class="{ selected: selectedOntologies.includes(ontology.id) }"
              >
                <input 
                  type="checkbox" 
                  :id="ontology.id"
                  :value="ontology.id"
                  v-model="selectedOntologies"
                />
                <label :for="ontology.id">
                  <div class="ontology-info">
                    <strong>{{ ontology.name }}</strong>
                    <span class="ontology-abbr">({{ ontology.id }})</span>
                  </div>
                  <p class="ontology-description">{{ ontology.description }}</p>
                  <div class="ontology-usage">
                    <span class="usage-tag">{{ ontology.usage }}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Fluid Dynamics Ontologies -->
          <div v-if="modelStats && modelStats.fluidDynamicsCount > 0" class="ontology-section">
            <h3>
              <input 
                type="checkbox" 
                id="select-all-fluid"
                :checked="allFluidSelected"
                @change="toggleAllFluid"
              />
              <label for="select-all-fluid">Fluid Dynamics Ontologies</label>
            </h3>
            <div class="ontology-list">
              <div 
                v-for="ontology in fluidDynamicsOntologies" 
                :key="ontology.id"
                class="ontology-item"
                :class="{ selected: selectedOntologies.includes(ontology.id) }"
              >
                <input 
                  type="checkbox" 
                  :id="ontology.id"
                  :value="ontology.id"
                  v-model="selectedOntologies"
                />
                <label :for="ontology.id">
                  <div class="ontology-info">
                    <strong>{{ ontology.name }}</strong>
                    <span class="ontology-abbr">({{ ontology.id }})</span>
                  </div>
                  <p class="ontology-description">{{ ontology.description }}</p>
                  <div class="ontology-usage">
                    <span class="usage-tag">{{ ontology.usage }}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Common Ontologies -->
          <div class="ontology-section">
            <h3>
              <input 
                type="checkbox" 
                id="select-all-common"
                :checked="allCommonSelected"
                @change="toggleAllCommon"
              />
              <label for="select-all-common">Common Ontologies (Required)</label>
            </h3>
            <div class="ontology-list">
              <div 
                v-for="ontology in commonOntologies" 
                :key="ontology.id"
                class="ontology-item"
                :class="{ selected: selectedOntologies.includes(ontology.id) }"
              >
                <input 
                  type="checkbox" 
                  :id="ontology.id"
                  :value="ontology.id"
                  v-model="selectedOntologies"
                />
                <label :for="ontology.id">
                  <div class="ontology-info">
                    <strong>{{ ontology.name }}</strong>
                    <span class="ontology-abbr">({{ ontology.id }})</span>
                  </div>
                  <p class="ontology-description">{{ ontology.description }}</p>
                  <div class="ontology-usage">
                    <span class="usage-tag">{{ ontology.usage }}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button 
            @click="proceedToTermSelection" 
            class="btn btn-primary"
            :disabled="selectedOntologies.length === 0"
          >
            Next: Select Terms ({{ selectedOntologies.length }} ontolog{{ selectedOntologies.length === 1 ? 'y' : 'ies' }})
          </button>
          <button @click="selectRecommended" class="btn btn-secondary">
            Use Recommended Selection
          </button>
        </div>
      </div>

      <!-- Step 2: Select Common Terms -->
      <div v-else-if="currentStep === 2" class="step-content">
        <div class="modal-header">
          <div class="step-indicator">
            <span class="step completed">✓</span>
            <span class="step-line"></span>
            <span class="step active">2</span>
          </div>
          <h2>Step 2: Select Common Terms</h2>
          <p>Choose the specific terms you'll use from each ontology. This will make annotation faster.</p>
        </div>

        <div class="terms-selection-container">
          <div 
            v-for="ontologyId in selectedOntologies" 
            :key="ontologyId"
            class="ontology-terms-section"
          >
            <div class="ontology-terms-header">
              <h3>
                <input 
                  type="checkbox"
                  :id="`select-all-${ontologyId}`"
                  :checked="areAllTermsSelected(ontologyId)"
                  @change="toggleAllTerms(ontologyId, $event)"
                />
                <label :for="`select-all-${ontologyId}`">
                  {{ getOntologyCommonTerms(ontologyId)?.name || ontologyId }}
                </label>
              </h3>
              <span class="selected-count">
                {{ getSelectedTermsCount(ontologyId) }} / {{ getOntologyCommonTerms(ontologyId)?.terms.length || 0 }} selected
              </span>
            </div>

            <div class="terms-search">
              <input 
                type="text"
                :placeholder="`Search ${getOntologyCommonTerms(ontologyId)?.name || ''} terms...`"
                v-model="termSearchQueries[ontologyId]"
                class="search-input"
              />
            </div>

            <div class="terms-grid-simple">
              <div
                v-for="term in getFilteredTermsForOntology(ontologyId)"
                :key="term.id"
                class="term-item"
                :class="{ selected: isTermSelected(term.id) }"
              >
                <input
                  type="checkbox"
                  :id="term.id"
                  :value="term.id"
                  v-model="selectedTerms"
                />
                <label :for="term.id">
                  <span class="term-id">{{ term.id }}</span>
                  <span class="term-label">{{ term.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="currentStep = 1" class="btn btn-secondary">
            ← Back to Ontologies
          </button>
          <button 
            @click="confirmSelection" 
            class="btn btn-primary"
          >
            Complete Setup ({{ selectedTerms.length }} terms selected)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ontologyCommonTerms } from '../config/ontologyCommonTerms'

const props = defineProps({
  modelStats: Object
})

const emit = defineEmits(['ontologies-selected'])

const currentStep = ref(1)
const selectedOntologies = ref([])
const selectedTerms = ref([])
const termSearchQueries = ref({})

const biochemistryOntologies = [
  {
    id: 'CHEBI',
    name: 'Chemical Entities of Biological Interest',
    description: 'For atoms, small molecules, and metabolites',
    usage: 'Species/Molecules',
    searchUrl: 'https://www.ebi.ac.uk/chebi/'
  },
  {
    id: 'GO',
    name: 'Gene Ontology (Cellular Component)',
    description: 'For cellular compartments and subcellular structures',
    usage: 'Compartments',
    searchUrl: 'https://www.ebi.ac.uk/QuickGO/'
  },
  {
    id: 'GO_BP',
    name: 'Gene Ontology (Biological Process)',
    description: 'For biological processes and molecular activities',
    usage: 'Bioprocesses/Activities',
    searchUrl: 'https://www.ebi.ac.uk/QuickGO/'
  },
  {
    id: 'PR',
    name: 'Protein Ontology',
    description: 'For protein entities',
    usage: 'Proteins/Mediators',
    searchUrl: 'https://www.ebi.ac.uk/ols4/ontologies/pr'
  },
  {
    id: 'UNIPROT',
    name: 'UniProt',
    description: 'Comprehensive protein database',
    usage: 'Proteins/Mediators',
    searchUrl: 'https://www.uniprot.org/'
  },
  {
    id: 'CL',
    name: 'Cell Ontology',
    description: 'For cell types',
    usage: 'Cell Types',
    searchUrl: 'https://www.ebi.ac.uk/ols4/ontologies/cl'
  },
  {
    id: 'SBO',
    name: 'Systems Biology Ontology',
    description: 'For modeling and simulation concepts',
    usage: 'Process Types',
    searchUrl: 'https://www.ebi.ac.uk/ols4/ontologies/sbo'
  }
]

const fluidDynamicsOntologies = [
  {
    id: 'FMA',
    name: 'Foundational Model of Anatomy',
    description: 'For human anatomical structures (tissue scale and higher)',
    usage: 'Anatomical Structures/Fluids',
    searchUrl: 'https://bioportal.bioontology.org/ontologies/FMA'
  },
  {
    id: 'UBERON',
    name: 'Uberon',
    description: 'Cross-species anatomy ontology',
    usage: 'Anatomical Structures',
    searchUrl: 'https://www.ebi.ac.uk/ols4/ontologies/uberon'
  }
]

const commonOntologies = [
  {
    id: 'OPB',
    name: 'Ontology of Physics for Biology',
    description: 'For physical properties and processes',
    usage: 'Physical Properties (Required)',
    searchUrl: 'https://bioportal.bioontology.org/ontologies/OPB'
  }
]

const handleClose = () => {
  if (currentStep.value === 2 || selectedOntologies.value.length > 0) {
    const confirmed = confirm('Are you sure you want to close? Your selection will be lost.')
    if (confirmed) {
      emit('close')
    }
  } else {
    emit('close')
  }
}

// Handle clicking outside the modal
const handleOverlayClick = () => {
  handleClose()
}

// Step 1: Ontology selection functions
const allBiochemSelected = computed(() => {
  return biochemistryOntologies.every(ont => selectedOntologies.value.includes(ont.id))
})

const allFluidSelected = computed(() => {
  return fluidDynamicsOntologies.every(ont => selectedOntologies.value.includes(ont.id))
})

const allCommonSelected = computed(() => {
  return commonOntologies.every(ont => selectedOntologies.value.includes(ont.id))
})

const toggleAllBiochem = (event) => {
  const ids = biochemistryOntologies.map(ont => ont.id)
  if (event.target.checked) {
    ids.forEach(id => {
      if (!selectedOntologies.value.includes(id)) {
        selectedOntologies.value.push(id)
      }
    })
  } else {
    selectedOntologies.value = selectedOntologies.value.filter(id => !ids.includes(id))
  }
}

const toggleAllFluid = (event) => {
  const ids = fluidDynamicsOntologies.map(ont => ont.id)
  if (event.target.checked) {
    ids.forEach(id => {
      if (!selectedOntologies.value.includes(id)) {
        selectedOntologies.value.push(id)
      }
    })
  } else {
    selectedOntologies.value = selectedOntologies.value.filter(id => !ids.includes(id))
  }
}

const toggleAllCommon = (event) => {
  const ids = commonOntologies.map(ont => ont.id)
  if (event.target.checked) {
    ids.forEach(id => {
      if (!selectedOntologies.value.includes(id)) {
        selectedOntologies.value.push(id)
      }
    })
  } else {
    selectedOntologies.value = selectedOntologies.value.filter(id => !ids.includes(id))
  }
}

const selectRecommended = () => {
  selectedOntologies.value = ['OPB']
  
  if (props.modelStats.biochemistryCount > 0) {
    selectedOntologies.value.push('CHEBI', 'GO', 'GO_BP', 'PR', 'UNIPROT')
  }
  
  if (props.modelStats.fluidDynamicsCount > 0) {
    selectedOntologies.value.push('FMA', 'UBERON')
  }
}

const proceedToTermSelection = () => {
  currentStep.value = 2
}

// Step 2: Term selection functions
const getOntologyCommonTerms = (ontologyId) => {
  return ontologyCommonTerms[ontologyId]
}

const isTermSelected = (termId) => {
  return selectedTerms.value.includes(termId)
}

const getSelectedTermsCount = (ontologyId) => {
  const ontology = ontologyCommonTerms[ontologyId]
  if (!ontology) return 0
  
  const ontologyTermIds = ontology.terms.map(t => t.id)
  return selectedTerms.value.filter(id => ontologyTermIds.includes(id)).length
}

const areAllTermsSelected = (ontologyId) => {
  const ontology = ontologyCommonTerms[ontologyId]
  if (!ontology) return false
  
  const ontologyTermIds = ontology.terms.map(t => t.id)
  return ontologyTermIds.every(id => selectedTerms.value.includes(id))
}

const toggleAllTerms = (ontologyId, event) => {
  const ontology = ontologyCommonTerms[ontologyId]
  if (!ontology) return
  
  const termIds = ontology.terms.map(t => t.id)
  
  if (event.target.checked) {
    termIds.forEach(id => {
      if (!selectedTerms.value.includes(id)) {
        selectedTerms.value.push(id)
      }
    })
  } else {
    selectedTerms.value = selectedTerms.value.filter(id => !termIds.includes(id))
  }
}

const confirmSelection = () => {
  // Build the complete configuration
  const allOntologies = [
    ...biochemistryOntologies,
    ...fluidDynamicsOntologies,
    ...commonOntologies
  ]
  
  const ontologyConfig = {}
  
  selectedOntologies.value.forEach(ontId => {
    const ontologyDef = allOntologies.find(ont => ont.id === ontId)
    const commonTermsData = ontologyCommonTerms[ontId]
    
    // Get only the selected terms for this ontology
    const ontologyTermIds = commonTermsData?.terms.map(t => t.id) || []
    const selectedTermsForOntology = selectedTerms.value.filter(id => ontologyTermIds.includes(id))
    
    // Map term IDs to full term objects
    const selectedTermObjects = selectedTermsForOntology.map(termId => {
      return commonTermsData.terms.find(t => t.id === termId)
    }).filter(Boolean)
    
    ontologyConfig[ontId] = {
      ...ontologyDef,
      commonTerms: selectedTermObjects
    }
  })
  
  console.log('Final ontology config:', ontologyConfig)
  emit('ontologies-selected', ontologyConfig)
}

const getFilteredTermsForOntology = (ontologyId) => {
  const ontology = ontologyCommonTerms[ontologyId]
  if (!ontology) return []
  
  const query = termSearchQueries.value[ontologyId]?.toLowerCase() || ''
  if (!query) return ontology.terms
  
  return ontology.terms.filter(term => 
    term.id.toLowerCase().includes(query) || 
    term.label.toLowerCase().includes(query)
  )
}
</script>

<style scoped>
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.ontology-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.ontology-selector-modal {
  background: white;
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 30px 30px 20px;
  border-bottom: 2px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 24px;
}

.modal-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.model-analysis {
  padding: 20px 30px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.model-analysis h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.stat-item {
  background: white;
  padding: 15px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 13px;
  color: #666;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #4CAF50;
}

.ontology-sections {
  padding: 20px 30px;
}

.ontology-section {
  margin-bottom: 30px;
}

.ontology-section h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
  color: #333;
  font-size: 18px;
}

.ontology-section h3 input[type="checkbox"] {
  cursor: pointer;
}

.ontology-section h3 label {
  cursor: pointer;
  user-select: none;
}

.ontology-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 15px;
}

.ontology-item {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.ontology-item:hover {
  border-color: #4CAF50;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
}

.ontology-item.selected {
  border-color: #4CAF50;
  background: #f1f8f4;
}

.ontology-item input[type="checkbox"] {
  margin-right: 10px;
  cursor: pointer;
}

.ontology-item label {
  cursor: pointer;
  display: block;
  user-select: none;
}

.ontology-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ontology-info strong {
  color: #333;
  font-size: 15px;
}

.ontology-abbr {
  color: #666;
  font-size: 13px;
  font-weight: 500;
}

.ontology-description {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.ontology-usage {
  display: flex;
  gap: 8px;
}

.usage-tag {
  display: inline-block;
  padding: 4px 10px;
  background: #e3f2fd;
  color: #1976D2;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.modal-actions {
  padding: 20px 30px;
  border-top: 2px solid #e0e0e0;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.btn-secondary {
  background-color: #2196F3;
  color: white;
}

.btn-secondary:hover {
  background-color: #1976D2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.step {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.step.active {
  background: #4CAF50;
  color: white;
}

.step.completed {
  background: #2196F3;
  color: white;
}

.step-line {
  width: 60px;
  height: 2px;
  background: #e0e0e0;
}

.terms-selection-container {
  padding: 20px 30px;
  max-height: 60vh;
  overflow-y: auto;
}

.ontology-terms-section {
  margin-bottom: 30px;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
}

.ontology-terms-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.ontology-terms-header h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: #333;
  font-size: 18px;
}

.ontology-terms-header h3 input[type="checkbox"] {
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.ontology-terms-header h3 label {
  cursor: pointer;
  user-select: none;
}

.selected-count {
  font-size: 14px;
  color: #666;
  padding: 6px 12px;
  background: white;
  border-radius: 4px;
  font-weight: 500;
}

.terms-search {
  margin-bottom: 15px;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.terms-grid-simple {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
}

.terms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
}

.term-item {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 10px;
  transition: all 0.2s ease;
  cursor: pointer;
  background: white;
}

.term-item:hover {
  border-color: #4CAF50;
  box-shadow: 0 2px 6px rgba(76, 175, 80, 0.15);
}

.term-item.selected {
  border-color: #4CAF50;
  background: #f1f8f4;
}

.term-item input[type="checkbox"] {
  margin-right: 8px;
  cursor: pointer;
}

.term-item label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  width: 100%;
}

.term-id {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  margin-right: 8px;
  white-space: nowrap;
}

.term-label {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.term-item.selected .term-id {
  background: #c8e6c9;
  color: #2e7d32;
}

.term-item.selected .term-label {
  color: #2e7d32;
  font-weight: 500;
}

/* Scrollbar styling */
.terms-selection-container::-webkit-scrollbar {
  width: 8px;
}

.terms-selection-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.terms-selection-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.terms-selection-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

</style>
