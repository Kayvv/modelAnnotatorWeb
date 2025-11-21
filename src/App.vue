<template>
  <div class="container">
    <div class="header">
      <h1>CellML Annotation GUI</h1>
      <p>Add semantic annotations to CellML models</p>
    </div>

    <!-- Ontology Selector Modal -->
    <OntologySelector
      v-if="showOntologySelector"
      :model-stats="modelStats"
      @ontologies-selected="handleOntologiesSelected"
      @close="handleOntologySelectorClose"
    />

    <div class="content">
      <div class="left-panel">
        <FileLoader 
          @file-loaded="handleFileLoaded" 
          @rdf-loaded="handleRDFLoaded"
        />
        <ModelInfo 
          v-if="model" 
          :model="model" 
          :components="components"
          :total-variables="getTotalVariables()"
          :import-issues="importIssues"
          :has-unresolved-imports="hasUnresolvedImports"
          :import-urls="importUrls"
          @import-file-uploaded="handleImportFileUpload"
        />

  <ComponentVariablesList 
    v-if="Object.keys(groupedVariables).length > 0"
    :grouped-variables="groupedVariables" 
    :selected-variable="selectedVariable"
    :annotations="annotations"
    @variable-selected="handleVariableSelected"
  />
      </div>

      <div class="right-panel">
        <div v-if="!userOntologies" class="waiting-state">
          <h3>Please select ontologies to begin annotation</h3>
          <p>Upload a CellML file and select the ontologies you'll use.</p>
          <button 
            v-if="model" 
            @click="showOntologySelector = true" 
            class="btn btn-primary"
          >
            Select Ontologies
          </button>
        </div>
        
        <div v-else-if="selectedVariable">
          <h3>Annotating: {{ selectedVariable.name }}</h3>
          <p>Category: <strong>{{ selectedVariable.category || 'Uncategorized' }}</strong></p>
          <p>Units: <strong>{{ selectedVariable.units }}</strong></p>
          
          <!-- Display selected ontologies -->
          <div class="selected-ontologies-info">
            <button @click="showOntologySelector = true" class="btn-change-ontologies">
              📚 Change Ontologies ({{ Object.keys(userOntologies).length }} selected)
            </button>
          </div>
          
          <div class="rdf-stats">
            <p>Total RDF triples: <strong>{{ rdfTripleCount }}</strong></p>
          </div>
          
          <DynamicAnnotationForm
            :selected-variable="selectedVariable"
            :variable-category="selectedVariable.category || 'Uncategorized'"
            :user-ontologies="userOntologies"
            @annotation-added="handleAnnotationAdded"
          />
          
          <AnnotationList 
            v-if="currentAnnotations.length > 0"
            :annotations="currentAnnotations"
          />
          
          <div class="export-buttons">
            <button @click="handleExportRDF" class="btn btn-success">
              Export RDF (Turtle)
            </button>
            <button @click="handleClearAnnotations" class="btn btn-danger">
              Clear All Annotations
            </button>
          </div>
        </div>
        <div v-else-if="userOntologies" class="empty-state">
          <h3>Select a variable to annotate</h3>
          <p>Choose a variable from the list on the left.</p>
        </div>
      </div>
    </div>
    
    <MessageDisplay :message="message" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import FileLoader from './components/FileLoader.vue'
import ModelInfo from './components/ModelInfo.vue'
import ComponentVariablesList from './components/ComponentVariablesList.vue'
import DynamicAnnotationForm from './components/DynamicAnnotationForm.vue'
import AnnotationList from './components/AnnotationList.vue'
import MessageDisplay from './components/MessageDisplay.vue'
import OntologySelector from './components/OntologySelector.vue'
import { useCellML } from './composables/useCellML'
import { useAnnotations } from './composables/useAnnotations'

const { 
  model,
  components,
  groupedVariables, 
  parseModel, 
  initLibCellML,
  importIssues,
  hasUnresolvedImports,
  importUrls,
  addImportedFile
} = useCellML()

const {
  selectedVariable,
  currentAnnotations,
  selectVariable,
  addAnnotation,
  exportRDF,
  importRDF,
  clearAllAnnotations,
  getAnnotationCount,
  annotations
} = useAnnotations()

const getTotalVariables = () => {
  let total = 0
  Object.values(groupedVariables.value).forEach(componentData => {
    total += componentData.totalVariables
  })
  return total
}

const message = ref({ text: '', type: '' })
const showOntologySelector = ref(false)
const userOntologies = ref(null)

const rdfTripleCount = computed(() => {
  return getAnnotationCount()
})


const handleImportFileUpload = async ({ filename, content }) => {
  try {
    const success = await addImportedFile(filename, content)
    
    if (success) {
      showMessage(`✓ Import file "${filename}" loaded successfully`, 'success')
      
      if (!hasUnresolvedImports.value) {
        showMessage('All imports resolved!', 'success')
      }
    } else {
      showMessage(`✗ Failed to load import file "${filename}"`, 'error')
    }
  } catch (error) {
    showMessage(`Error loading import: ${error.message}`, 'error')
  }
}

// Calculate model statistics for ontology selection
const modelStats = computed(() => {
  if (!groupedVariables.value) return null
  
  let biochemistryCount = 0
  let fluidDynamicsCount = 0
  let totalVariables = 0
  
  Object.values(groupedVariables.value).forEach(variables => {
    Object.values(variables.categories).forEach(category => {
      Object.values(category).forEach(variable => {
        totalVariables++
        if (variable.domain === 'Biochemistry') {
          biochemistryCount++
        } else if (variable.domain === 'Fluid dynamics') {
          fluidDynamicsCount++
        }
      })
    })
  })
  
  return {
    totalVariables,
    biochemistryCount,
    fluidDynamicsCount
  }
})

onMounted(() => {
  initLibCellML()
})

const handleFileLoaded = async (content) => {
  try {
    await parseModel(content)
    
  } catch (error) {
    showMessage(`❌ Error loading model: ${error.message}`, 'error')
  }
}

const handleRDFLoaded = async (content) => {
  try {
    if (!model.value) {
      showMessage('⚠️ Please load a CellML model first before importing RDF annotations', 'warning')
      return
    }
    
    const tripleCount = await importRDF(content, model.value)

    if (selectedVariable.value) {
      const currentVar = selectedVariable.value
      selectVariable(null)
      setTimeout(() => {
        selectVariable(currentVar)
      }, 100)
    }
    
    const annotatedVarCount = Object.keys(annotations.value).length
    showMessage(`✅ Successfully imported ${tripleCount} RDF triples for ${annotatedVarCount} variables`, 'success')
  } catch (error) {
    console.error('RDF load error:', error)
    showMessage(`❌ Error loading RDF: ${error.message}`, 'error')
  }
}

const handleOntologiesSelected = (ontologies) => {
  userOntologies.value = ontologies
  showOntologySelector.value = false
  console.log('User selected ontologies:', ontologies)
  showMessage(`${Object.keys(ontologies).length} ontologies selected`, 'success')
}

const handleOntologySelectorClose = () => {
  showOntologySelector.value = false
  if (!userOntologies.value && model.value) {
    showMessage('Ontology selection cancelled. Click "Select Ontologies" to continue.', 'info')
  }
}

const handleVariableSelected = (variable) => {
  selectVariable(variable)
}

const handleAnnotationAdded = (annotation) => {
  addAnnotation(annotation)
  showMessage('Annotation added successfully', 'success')
}

const handleExportRDF = async () => {
  try {
    const turtle = await exportRDF()
    
    const blob = new Blob([turtle], { type: 'text/turtle' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${model.value.name() || 'model'}_annotations.ttl`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    showMessage('RDF exported successfully', 'success')
  } catch (error) {
    console.error('Error exporting RDF:', error)
    showMessage('Error exporting RDF', 'error')
  }
}

const handleClearAnnotations = () => {
  if (confirm('Are you sure you want to clear all annotations? This cannot be undone.')) {
    clearAllAnnotations()
    showMessage('All annotations cleared', 'success')
  }
}

const showMessage = (text, type) => {
  message.value = { text, type }
  setTimeout(() => {
    message.value = { text: '', type: '' }
  }, 3000)
}
</script>

<style scoped>
.waiting-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.waiting-state h3 {
  margin-bottom: 10px;
  color: #666;
}

.selected-ontologies-info {
  margin: 15px 0;
}

.btn-change-ontologies {
  padding: 8px 16px;
  background: #e3f2fd;
  border: 1px solid #2196F3;
  border-radius: 6px;
  color: #1976D2;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-change-ontologies:hover {
  background: #2196F3;
  color: white;
}

.waiting-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.waiting-state h3 {
  margin-bottom: 10px;
  color: #666;
}

.waiting-state .btn {
  margin-top: 20px;
}
</style>