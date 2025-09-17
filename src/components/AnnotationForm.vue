<template>
  <div class="annotation-form">
    <div class="form-group">
      <label>Annotation:</label>
      <select v-model="form.type">
        <option value="description">Description</option>
        <option value="author">Author</option>
        <option value="version">Version</option>
        <option value="reference">Reference</option>
        <option value="custom">Custom</option>
      </select>
    </div>
    
    <div class="form-group" v-if="form.type === 'custom'">
      <label>Something can be input here:</label>
      <input v-model="form.customKey" placeholder="Please input some text" />
    </div>
    
    <div class="form-group">
      <label>Something can be input here:</label>
      <textarea 
        v-model="form.content" 
        placeholder="Please input some annotation..."
      ></textarea>
    </div>
    
    <button @click="handleAddAnnotation" class="btn">Add annotation</button>
    <button @click="clearForm" class="btn">Clear form</button>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['annotation-added'])

const form = reactive({
  type: 'description',
  customKey: '',
  content: ''
})

const handleAddAnnotation = () => {
  if (!form.content.trim()) return
  
  const key = form.type === 'custom' ? form.customKey : form.type
  if (!key.trim()) return
  
  emit('annotation-added', {
    key,
    value: form.content.trim()
  })
  
  clearForm()
}

const clearForm = () => {
  form.content = ''
  form.customKey = ''
}
</script>