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
          <h3>Add annotations to the variable: {{ selectedVariable.name }}</h3>
          <AnnotationForm 
            @annotation-added="handleAnnotationAdded"
            @export-model="handleExportModel"
          />
          <AnnotationList 
            v-if="currentAnnotations.length > 0"
            :annotations="currentAnnotations"
          />
          <div style="margin-top: 20px;">
            <button @click="handleExportModel" class="btn btn-success">
              Export CellML File
            </button>
          </div>
        </div>
        <div v-else class="empty-state">
          <h3>Please upload CellML file and select a component.</h3>
          <p>Then can start annotation.</p>
        </div>
      </div>
    </div>
    
    <MessageDisplay :message="message" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import FileLoader from './components/FileLoader.vue'
import ModelInfo from './components/ModelInfo.vue'
import VariableGroupsList from './components/VariableGroupsList.vue'
import AnnotationForm from './components/AnnotationForm.vue'
import AnnotationList from './components/AnnotationList.vue'
import MessageDisplay from './components/MessageDisplay.vue'
import { useCellML } from './composables/useCellML'
import { useAnnotations } from './composables/useAnnotations'

const { 
  model, 
  components,
  groupedVariables, 
  parseModel, 
  exportModel, 
  initLibCellML 
} = useCellML()

const {
  selectedComponent,
  selectedVariable,
  currentAnnotations,
  selectComponent,
  selectVariable,
  addAnnotation
} = useAnnotations(components)

const message = ref({ text: '', type: '' })

onMounted(() => {
  initLibCellML()
})

const handleFileLoaded = (content) => {
  parseModel(content)
  showMessage('Model load', 'success')
}

const handleComponentSelected = (component) => {
  selectComponent(component)
}

const handleVariableSelected = (variable) => {
  selectVariable(variable)
}

const handleAnnotationAdded = (annotation) => {
  addAnnotation(annotation)
  showMessage('Annotation added success', 'success')
}

const handleExportModel = () => {
  exportModel()
  showMessage('Annotation added success', 'success')
}

const showMessage = (text, type) => {
  message.value = { text, type }
  setTimeout(() => {
    message.value = { text: '', type: '' }
  }, 3000)
}
</script>
