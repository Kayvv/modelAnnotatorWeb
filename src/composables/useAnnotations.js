import { ref, computed } from 'vue'

export function useAnnotations(variables) {
    const selectedVariable = ref(null)
    const annotations = ref({})

    const currentAnnotations = computed(() => {
        if (!selectedVariable.value) return []
        return annotations.value[selectedVariable.value.name] || []
    })

    const selectVariable = (variable) => {
        selectedVariable.value = variable
        loadCurrentAnnotations(variable)
    }

    const loadCurrentAnnotations = (variable) => {
        // Add current annotations
        if (!annotations.value[variable.name]) {
            annotations.value[variable.name] = []
        }
    }

    const addAnnotation = (annotation) => {
        if (!selectedVariable.value) return

        const variableName = selectedVariable.value.name
        if (!annotations.value[variableName]) {
            annotations.value[variableName] = []
        }

        const existingIndex = annotations.value[variableName]
            .findIndex(a => a.key === annotation.key)

        if (existingIndex >= 0) {
            annotations.value[variableName][existingIndex] = annotation
        } else {
            annotations.value[variableName].push(annotation)
        }
    }

    return {
        selectedVariable,
        currentAnnotations,
        selectVariable,
        addAnnotation
    }
}