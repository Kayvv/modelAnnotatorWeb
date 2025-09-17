<template>
  <div class="file-input">
    <h3>Upload Model File</h3>
    <input 
      type="file" 
      @change="handleFileChange" 
      accept=".cellml,.xml" 
    />
    <p>Please upload .cellml and .xml files</p>
  </div>
</template>

<script setup>
const emit = defineEmits(['file-loaded'])

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    emit('file-loaded', e.target.result)
  }
  reader.readAsText(file)
}
</script>