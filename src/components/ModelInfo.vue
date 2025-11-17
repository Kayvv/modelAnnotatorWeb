<template>
  <div class="model-info">
    <h4>Model Info</h4>
    <p><strong>Name:</strong> {{ model.name() || 'No name' }}</p>
    <p><strong>Components:</strong> {{ components.length }}</p>
    <p><strong>Total Variables:</strong> {{ totalVariables }}</p>

    <div v-if="importUrls && importUrls.length > 0" class="import-files-info">
      <p class="import-files-label">
        <strong>📁 Required Import Files:</strong>
      </p>
      <ul class="import-files-list">
        <li 
          v-for="(url, index) in importUrls" 
          :key="index"
          class="import-file-item"
        >
          <div class="import-file-item">
          <span class="file-icon">📄</span>
          <code class="file-name">{{ url }}</code>

            <label>
          <span v-if="uploadedFiles.includes(url)" class="status-uploaded">
              ✓ Uploaded
            </span>
            
          <span  v-else :for="`upload-${index}`" class="upload-btn">
              📤 Upload
            </span>
              
              <input
                :id="`upload-${index}`"
                type="file" 
                accept=".cellml,.xml"
                @change="handleImportFileUpload($event, url)"
                style="display: none"
              />
            </label>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="importIssues && importIssues.length > 0" class="import-status">
      <div 
        v-if="hasUnresolvedImports" 
        class="import-warning"
      >
        <div class="import-header">
          <span class="warning-icon">⚠️</span>
          <strong>Import Issues Detected</strong>
        </div>
        <div class="import-details">
          <p class="warning-text">Some imports could not be resolved. Variables may not be categorized correctly.</p>
          <button 
            @click="showDetails = !showDetails" 
            class="toggle-details-btn"
          >
            {{ showDetails ? '▼ Hide Details' : '▶ Show Details' }}
          </button>
          <div v-if="showDetails" class="import-issues-list">
            <div 
              v-for="(issue, index) in importIssues" 
              :key="index"
              :class="['import-issue-item', `issue-${issue.type}`]"
            >
              {{ issue.message }}
            </div>
          </div>
        </div>
      </div>
      
      <div 
        v-else 
        class="import-success"
      >
        <span class="success-icon">✓</span>
        <strong>All imports resolved</strong>
        <button 
          v-if="importIssues.length > 0"
          @click="showDetails = !showDetails" 
          class="toggle-details-btn-small"
        >
          {{ showDetails ? '▼' : 'ℹ️' }}
        </button>
        <div v-if="showDetails" class="import-issues-list">
          <div 
            v-for="(issue, index) in importIssues" 
            :key="index"
            class="import-issue-item issue-info"
          >
            {{ issue.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  model: Object,
  components: Array,
  totalVariables: Number,
  importIssues: Array,
  hasUnresolvedImports: Boolean,
  importUrls: Array
})

const showDetails = ref(false)
const emit = defineEmits(['import-file-uploaded'])
const uploadedFiles = ref([])

const handleImportFileUpload = (event, expectedUrl) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.readAsText(file)
  reader.onload = (e) => {
    emit('import-file-uploaded', {
      filename: expectedUrl,
      content: e.target.result
    })
    uploadedFiles.value.push(expectedUrl)
  }
}
</script>

<style scoped>
.status-uploaded {
  padding: 4px 8px;
  background: #4CAF50;
  color: white;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: auto;
  flex-shrink: 0;
}

.upload-btn {
  padding: 4px 8px;
  background: #e7a24c;
  color: white;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: auto;
  flex-shrink: 0;
}

.upload-btn:hover {
  background: #dbb023;
  transform: scale(1.05);
}

.model-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.model-info h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.model-info p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.import-status {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 2px solid #e0e0e0;
}

.import-warning {
  background: #fff3e0;
  border: 2px solid #ff9800;
  border-radius: 8px;
  padding: 12px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    border-color: #ff9800;
    box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.4);
  }
  50% {
    border-color: #f57c00;
    box-shadow: 0 0 0 4px rgba(255, 152, 0, 0.2);
  }
}

.import-success {
  background: #e8f5e9;
  border: 2px solid #4CAF50;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.import-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.warning-icon {
  font-size: 20px;
  animation: shake 0.5s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

.success-icon {
  color: #4CAF50;
  font-size: 18px;
  font-weight: bold;
}

.import-details {
  margin-top: 8px;
}

.warning-text {
  margin: 8px 0;
  color: #e65100;
  font-size: 13px;
  font-weight: 500;
}

.toggle-details-btn {
  background: #fff;
  border: 1px solid #ff9800;
  color: #e65100;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s;
  margin-top: 8px;
}

.toggle-details-btn:hover {
  background: #ff9800;
  color: white;
}

.toggle-details-btn-small {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  margin-left: auto;
}

.import-issues-list {
  margin-top: 10px;
  padding: 10px;
  background: white;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.import-issue-item {
  padding: 6px 10px;
  margin-bottom: 6px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  border-left: 3px solid;
}

.issue-unresolved_import {
  background: #ffebee;
  border-left-color: #f44336;
  color: #c62828;
}

.issue-importer_issue {
  background: #fff3e0;
  border-left-color: #ff9800;
  color: #e65100;
}

.issue-info {
  background: #e3f2fd;
  border-left-color: #2196F3;
  color: #1565c0;
}

.issue-error {
  background: #ffebee;
  border-left-color: #f44336;
  color: #c62828;
  font-weight: 500;
}

.import-issue-item:last-child {
  margin-bottom: 0;
}


.import-files-info {
  margin-top: 12px;
  padding: 10px;
  background: #e3f2fd;
  border-left: 4px solid #2196F3;
  border-radius: 4px;
}

.import-files-label {
  margin: 0 0 8px 0;
  color: #1565c0;
  font-size: 14px;
}

.import-files-list {
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.import-file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  margin-bottom: 4px;
  background: white;
  border-radius: 4px;
  font-size: 13px;
}

.import-file-item:last-child {
  margin-bottom: 0;
}

.file-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.file-name {
  font-family: 'Courier New', Consolas, monospace;
  color: #1565c0;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  word-break: break-all;
}

.import-issues-list::-webkit-scrollbar {
  width: 6px;
}

.import-issues-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.import-issues-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.import-issues-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>