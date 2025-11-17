<template>
  <div class="annotation-list">
    <h4>Current Annotations</h4>
    <div v-if="annotations.length === 0" class="no-annotations">
      <p>No annotations added yet</p>
    </div>
    <div v-else class="annotations-container">
      <div 
        v-for="(annotation, index) in annotations" 
        :key="index" 
        class="annotation-card"
      >
        <div class="annotation-header">
          <span class="annotation-type">{{ annotation.type }}</span>
          <span class="annotation-domain">{{ annotation.domain }}</span>
        </div>
        <div class="annotation-details">
          <div 
            v-for="(detail, detailIndex) in annotation.details" 
            :key="detailIndex"
            class="detail-item"
          >
            <span class="detail-label">{{ detail.label }}:</span>
            <span class="detail-value">{{ detail.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  annotations: Array
})
</script>

<style scoped>
.annotation-list {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #e0e0e0;
}

.annotation-list h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
}

.no-annotations {
  text-align: center;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  color: #999;
}

.annotations-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.annotation-card {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
}

.annotation-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.annotation-header {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.annotation-type {
  padding: 4px 12px;
  background: #e3f2fd;
  color: #1976D2;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
}

.annotation-domain {
  padding: 4px 12px;
  background: #f3e5f5;
  color: #7b1fa2;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
}

.annotation-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  gap: 8px;
  font-size: 14px;
}

.detail-label {
  font-weight: 600;
  color: #666;
  min-width: 150px;
}

.detail-value {
  color: #333;
  font-family: 'Courier New', monospace;
  background: #fff;
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid #e0e0e0;
}
</style>