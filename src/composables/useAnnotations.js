import { ref, computed } from 'vue'
import { useRDF } from './useRDF'

export function useAnnotations() {
    const selectedVariable = ref(null)
    const annotations = ref({})
    const { addAnnotation: addRDFAnnotation, exportToTurtle, clearAnnotations, getAnnotationCount } = useRDF()

    const currentAnnotations = computed(() => {
        if (!selectedVariable.value) return []
        const varKey = getVariableKey(selectedVariable.value)
        return annotations.value[varKey] || []
    })

    const getVariableKey = (variable) => {
        return `${variable.component.name}.${variable.name}`
    }

    const selectVariable = (variable) => {
        selectedVariable.value = variable
        loadCurrentAnnotations(variable)
    }

    const loadCurrentAnnotations = (variable) => {
        const varKey = getVariableKey(variable)
        if (!annotations.value[varKey]) {
            annotations.value[varKey] = []
        }
    }

    const addAnnotation = (annotation) => {
        if (!selectedVariable.value) {
            console.error('No variable selected')
            return
        }

        console.log('Adding annotation:', annotation)

        const varKey = getVariableKey(selectedVariable.value)

        try {
            const enrichedAnnotation = {
                ...annotation,
                variable: {
                    ...selectedVariable.value
                }
            }

            addRDFAnnotation(enrichedAnnotation)
            console.log('RDF annotation added successfully')
            console.log('Total RDF triples:', getAnnotationCount())
        } catch (error) {
            console.error('Error adding RDF annotation:', error)
        }

        if (!annotations.value[varKey]) {
            annotations.value[varKey] = []
        }

        const annotationSummary = createAnnotationSummary(annotation)
        console.log('Created annotation summary:', annotationSummary)

        const existingIndex = annotations.value[varKey]
            .findIndex(a => a.type === annotation.type)

        if (existingIndex >= 0) {
            annotations.value[varKey][existingIndex] = annotationSummary
        } else {
            annotations.value[varKey].push(annotationSummary)
        }

        console.log('Current annotations for variable:', annotations.value[varKey])
    }

    const createAnnotationSummary = (annotation) => {
        const { type, domain, data } = annotation

        console.log('Creating summary for:', { type, domain, data })

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
                    { label: 'Source Multiplier', value: data.source?.multiplier || 1 },
                    { label: 'Sink Species', value: data.sink?.species || 'N/A' },
                    { label: 'Sink Compartment', value: data.sink?.compartment || 'N/A' },
                    { label: 'Sink Multiplier', value: data.sink?.multiplier || 1 },
                    { label: 'Mediator', value: data.mediator?.protein || 'None' },
                    { label: 'Mediator Compartment', value: data.mediator?.compartment || 'N/A' },
                    { label: 'Bioprocess', value: data.bioprocess || 'N/A' },
                    { label: 'Physical Property', value: data.physicalProperty || 'N/A' }
                ]
            } else if (type === 'Efforts') {
                summary.details = [
                    { label: 'Source Species', value: data.source?.species || 'N/A' },
                    { label: 'Source Compartment', value: data.source?.compartment || 'N/A' },
                    { label: 'Sink Species', value: data.target?.species || 'N/A' },
                    { label: 'Sink Compartment', value: data.target?.compartment || 'N/A' },
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
                    { label: 'Source Multiplier', value: data.source?.multiplier || 1 },
                    { label: 'Sink Fluid', value: data.sink?.fluid || 'N/A' },
                    { label: 'Sink Compartment', value: data.sink?.compartment || 'N/A' },
                    { label: 'Sink Multiplier', value: data.sink?.multiplier || 1 },
                    { label: 'Mediator', value: data.mediator?.protein || 'None' },
                    { label: 'Mediator Compartment', value: data.mediator?.compartment || 'N/A' },
                    { label: 'Physical Property', value: data.physicalProperty || 'N/A' }
                ]
            } else if (type === 'Efforts') {
                summary.details = [
                    { label: 'Source Location', value: data.source?.location || 'N/A' },
                    { label: 'Sink Location', value: data.target?.location || 'N/A' },
                    { label: 'Physical Property', value: data.physicalProperty || 'N/A' }
                ]
            }
        }

        console.log('Summary created:', summary)
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
        getAnnotationCount,
        annotations
    }
}