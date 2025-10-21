import { ref, computed } from 'vue'
import { useRDF } from './useRDF'

export function useAnnotations(modelName) {
    const selectedVariable = ref(null)
    const annotations = ref({})
    const { addAnnotation: addRDFAnnotation, exportToTurtle, clearAnnotations, getAnnotationCount } = useRDF()

    const currentAnnotations = computed(() => {
        if (!selectedVariable.value) return []
        return annotations.value[selectedVariable.value.name] || []
    })

    const selectVariable = (variable) => {
        selectedVariable.value = variable
        loadCurrentAnnotations(variable)
    }

    const loadCurrentAnnotations = (variable) => {
        if (!annotations.value[variable.name]) {
            annotations.value[variable.name] = []
        }
    }

    const addAnnotation = (annotation) => {
        if (!selectedVariable.value) return

        const variableName = selectedVariable.value.name
        try {
            const enrichedAnnotation = {
                ...annotation,
                variable: {
                    ...selectedVariable.value,
                    modelName: modelName.value
                }
            }

            addRDFAnnotation(enrichedAnnotation)
            console.log('RDF annotation added successfully')
            console.log('Total RDF triples:', getAnnotationCount())
        } catch (error) {
            console.error('Error adding RDF annotation:', error)
        }

        if (!annotations.value[variableName]) {
            annotations.value[variableName] = []
        }

        const annotationSummary = createAnnotationSummary(annotation)

        const existingIndex = annotations.value[variableName]
            .findIndex(a => a.type === annotation.type)

        if (existingIndex >= 0) {
            annotations.value[variableName][existingIndex] = annotationSummary
        } else {
            annotations.value[variableName].push(annotationSummary)
        }
    }

    const createAnnotationSummary = (annotation) => {
        const { type, domain, data } = annotation
        let summary = {
            type: type,
            domain: domain,
            details: []
        }

        if (domain === 'Biochemistry') {
            if (type === 'Quantities') {
                summary.details = [
                    { label: 'Species', value: data.species || 'N/A' },
                    { label: 'Compartment', value: data.compartment || 'N/A' },
                    { label: 'Physical Property', value: data.physicalProperty || 'N/A' }
                ]
            } else if (type === 'Flow rates') {
                summary.details = [
                    { label: 'Source Species', value: data.source?.species || 'N/A' },
                    { label: 'Source Compartment', value: data.source?.compartment || 'N/A' },
                    { label: 'Sink Species', value: data.sink?.species || 'N/A' },
                    { label: 'Sink Compartment', value: data.sink?.compartment || 'N/A' },
                    { label: 'Mediator', value: data.mediator?.protein || 'None' },
                    { label: 'Bioprocess', value: data.bioprocess || 'N/A' },
                    { label: 'Physical Property', value: data.physicalProperty || 'N/A' }
                ]
            } else if (type === 'Efforts') {
                summary.details = [
                    { label: 'Source Species', value: data.source?.species || 'N/A' },
                    { label: 'Source Compartment', value: data.source?.compartment || 'N/A' },
                    { label: 'Target Species', value: data.target?.species || 'N/A' },
                    { label: 'Target Compartment', value: data.target?.compartment || 'N/A' },
                    { label: 'Physical Property', value: data.physicalProperty || 'N/A' }
                ]
            }
        } else if (domain === 'Fluid dynamics') {
            if (type === 'Quantities') {
                summary.details = [
                    { label: 'Fluid', value: data.fluid || 'N/A' },
                    { label: 'Compartment', value: data.compartment || 'N/A' },
                    { label: 'Physical Property', value: data.physicalProperty || 'N/A' }
                ]
            } else if (type === 'Flow rates') {
                summary.details = [
                    { label: 'Source Fluid', value: data.source?.fluid || 'N/A' },
                    { label: 'Source Compartment', value: data.source?.compartment || 'N/A' },
                    { label: 'Sink Fluid', value: data.sink?.fluid || 'N/A' },
                    { label: 'Sink Compartment', value: data.sink?.compartment || 'N/A' },
                    { label: 'Mediator', value: data.mediator?.protein || 'None' },
                    { label: 'Physical Property', value: data.physicalProperty || 'N/A' }
                ]
            } else if (type === 'Efforts') {
                summary.details = [
                    { label: 'Source Location', value: data.source?.location || 'N/A' },
                    { label: 'Target Location', value: data.target?.location || 'N/A' },
                    { label: 'Physical Property', value: data.physicalProperty || 'N/A' }
                ]
            }
        }

        return summary
    }

    const exportRDF = async () => {
        try {
            const turtle = await exportToTurtle()
            return turtle
        } catch (error) {
            console.error('Error exporting RDF:', error)
            throw error
        }
    }

    const clearAllAnnotations = () => {
        annotations.value = {}
        clearAnnotations()
    }

    return {
        selectedVariable,
        currentAnnotations,
        selectVariable,
        addAnnotation,
        exportRDF,
        clearAllAnnotations,
        getAnnotationCount
    }
}