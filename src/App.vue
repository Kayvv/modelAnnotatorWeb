<template>
  <div class="container">
    <div class="header">
      <h1>CellML Annotation GUI</h1>
      <p>Add annotations to CellML and SEDML models</p>
    </div>

    <div class="content">
      <div class="left-panel">
        <FileLoader @file-loaded="handleFileLoaded" />
        <ModelInfo v-if="model" :model="model" :components="components" />

        <VariableGroupsList 
          v-if="Object.keys(groupedVariables).length > 0"
          :grouped-variables="groupedVariables" 
          :selected-variable="selectedVariable"
          @variable-selected="handleVariableSelected"
        />
      </div>

      <div class="right-panel">
        <div v-if="selectedVariable">
          <h3>Annotating: {{ selectedVariable.name }}</h3>
          <p>Category: <strong>{{ selectedVariable.category || 'Uncategorized' }}</strong></p>
          <p>Units: <strong>{{ selectedVariable.units }}</strong></p>
          
          <div class="rdf-stats">
            <p>Total RDF triples: <strong>{{ rdfTripleCount }}</strong></p>
          </div>
          
          <DynamicAnnotationForm
            :selected-variable="selectedVariable"
            :variable-category="selectedVariable.category || 'Uncategorized'"
            @annotation-added="handleAnnotationAdded"
          />
          
          <AnnotationList 
            v-if="currentAnnotations.length > 0"
            :annotations="currentAnnotations"
          />
          
          <div class="export-buttons">
            <button @click="handleExportRDF" class="btn btn-primary">
              Export RDF (Turtle)
            </button>
            <button @click="handleExportCombined" class="btn btn-success">
              Export CellML + RDF
            </button>
            <button @click="handleClearAnnotations" class="btn btn-danger">
              Clear All Annotations
            </button>
          </div>
        </div>
        <div v-else class="empty-state">
          <h3>Please upload CellML file and select a variable.</h3>
          <p>Then start annotation.</p>
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
import VariableGroupsList from './components/VariableGroupsList.vue'
import DynamicAnnotationForm from './components/DynamicAnnotationForm.vue'
import AnnotationList from './components/AnnotationList.vue'
import MessageDisplay from './components/MessageDisplay.vue'
import { useCellML } from './composables/useCellML'
import { useAnnotations } from './composables/useAnnotations'

const { 
  model,
  modelName,
  components,
  groupedVariables, 
  parseModel, 
  exportModel, 
  initLibCellML 
} = useCellML()

const {
  selectedVariable,
  currentAnnotations,
  selectVariable,
  addAnnotation,
  exportRDF,
  clearAllAnnotations,
  getAnnotationCount
} = useAnnotations(components)

const message = ref({ text: '', type: '' })

const rdfTripleCount = computed(() => {
  return getAnnotationCount()
})

onMounted(() => {
  initLibCellML()
})

const handleFileLoaded = (content) => {
  parseModel(content)
  showMessage('Model loaded successfully', 'success')
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
    a.download = `${components.value || 'model'}_annotations.ttl`
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

const handleExportCombined = async () => {
  try {
    exportModel()
    
    await handleExportRDF()
    
    showMessage('CellML and RDF exported successfully', 'success')
  } catch (error) {
    console.error('Error exporting:', error)
    showMessage('Error exporting files', 'error')
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
