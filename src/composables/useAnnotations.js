import { ref, computed } from 'vue'

export function useAnnotations(components) {
    const selectedComponent = ref(null)
    const annotations = ref({})

    const currentAnnotations = computed(() => {
        if (!selectedComponent.value) return []
        return annotations.value[selectedComponent.value.name] || []
    })

    const selectComponent = (component) => {
        selectedComponent.value = component
        loadCurrentAnnotations(component)
    }

    const loadCurrentAnnotations = (component) => {
        // Add current annotations
        if (!annotations.value[component.name]) {
            annotations.value[component.name] = []
        }
    }

    const addAnnotation = (annotation) => {
        if (!selectedComponent.value) return

        const componentName = selectedComponent.value.name
        if (!annotations.value[componentName]) {
            annotations.value[componentName] = []
        }

        const existingIndex = annotations.value[componentName]
            .findIndex(a => a.key === annotation.key)

        if (existingIndex >= 0) {
            annotations.value[componentName][existingIndex] = annotation
        } else {
            annotations.value[componentName].push(annotation)
        }
    }

    return {
        selectedComponent,
        currentAnnotations,
        selectComponent,
        addAnnotation
    }
}