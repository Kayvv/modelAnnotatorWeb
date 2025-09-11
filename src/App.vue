<template>
  <div class="p-6 min-h-screen bg-gray-100 flex flex-col items-center">
    <h1 class="text-2xl font-bold mb-4">CellML Annotator Demo</h1>

    <input
      type="file"
      accept=".cellml,.xml"
      @change="handleFileUpload"
      class="mb-4"
    />

    <pre class="bg-white p-4 rounded shadow w-full max-w-lg">
      {{ modelInfo || "Upload a CellML file to see details here" }}
    </pre>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import libcellmlModule from "libcellml.js"; 
import libCellMLWasm from 'libcellml.js/libcellml.wasm'

const libcellml = ref(null);
const modelInfo = ref("");

// // Load libcellml WASM
onMounted(async () => {
  libcellml.value = await libcellmlModule(
  {locateFile(path, prefix) {
    if(path.endsWith('.wasm')) {
      return libCellMLWasm
    }
    return prefix + path
  }});
  console.log("✅ libcellml loaded:", libcellml.value);
});

const handleFileUpload = async (event) => {
  console.log("Uploaded")
  const file = event.target.files[0];
  console.log(event.target.files[0])
  console.log(!libcellml.value)
  if (!file || !libcellml.value) return;

  const text = await file.text();

  // Create libcellml parser
  const parser = new libcellml.value.Parser(false);
  const model = parser.parseModel(text);

  if (!model) {
    modelInfo.value = "❌ Failed to parse CellML file";
    return;
  }

  // Get model info
  const name = model.name();
  const components = model.componentCount();

  modelInfo.value = `✅ Model loaded!\nName: ${name}\nComponents: ${components}`;
};
</script>

<style>
body {
  font-family: sans-serif;
}
</style>
