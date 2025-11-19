<template>
  <div class="file-input-container">
    <div class="file-input">
      <h3>Upload Model File</h3>
      <input 
        type="file" 
        @change="handleFileChange" 
        accept=".cellml,.xml" 
      />
      <p>Please upload .cellml and .xml files</p>
    </div>
    
    <div class="file-input rdf-input">
      <h3>Upload RDF Annotations (Optional)</h3>
      <input 
        type="file" 
        @change="handleRDFChange" 
        accept=".ttl,.rdf,.owl" 
      />
      <p>Upload existing .ttl (Turtle) RDF annotation file</p>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['file-loaded', 'rdf-loaded'])

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    emit('file-loaded', e.target.result)
  }
  reader.readAsText(file)
}

const handleRDFChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    emit('rdf-loaded', e.target.result)
  }
  reader.readAsText(file)
}
</script>

<style scoped>
.file-input-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.file-input {
  padding: 15px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  text-align: center;
  transition: border-color 0.3s;
}

.file-input:hover {
  border-color: #2196F3;
}

.rdf-input {
  border-color: #4CAF50;
  background: #f1f8f4;
}

.rdf-input:hover {
  border-color: #45a049;
}

.file-input h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.file-input input {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
}

.file-input p {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #666;
}
</style>