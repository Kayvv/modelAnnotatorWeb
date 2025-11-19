import { ref, computed } from 'vue'
import { useRDF } from './useRDF'

// Create shared RDF instance
const rdf = useRDF()

export function useAnnotations() {
    const selectedVariable = ref(null)
    const annotations = ref({})

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

        // Remove existing RDF annotations for this variable
        const variableURI = `#${selectedVariable.value.component.name}.${selectedVariable.value.name}`
        rdf.removeAnnotationsForVariable(variableURI)

        try {
            const enrichedAnnotation = {
                ...annotation,
                variable: {
                    ...selectedVariable.value
                }
            }

            rdf.addAnnotation(enrichedAnnotation)
            console.log('RDF annotation added successfully')
            console.log('Total RDF triples:', rdf.getAnnotationCount())
        } catch (error) {
            console.error('Error adding RDF annotation:', error)
        }

        if (!annotations.value[varKey]) {
            annotations.value[varKey] = []
        }

        const annotationSummary = createAnnotationSummary(annotation)
        console.log('Created annotation summary:', annotationSummary)

        // Replace existing annotation of same type
        const existingIndex = annotations.value[varKey]
            .findIndex(a => a.type === annotation.type)

        if (existingIndex >= 0) {
            annotations.value[varKey][existingIndex] = annotationSummary
            console.log('Replaced existing annotation')
        } else {
            annotations.value[varKey].push(annotationSummary)
            console.log('Added new annotation')
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
            const turtle = await rdf.exportToTurtle()
            return turtle
        } catch (error) {
            console.error('Error exporting RDF:', error)
            throw error
        }
    }

    const importRDF = async (turtleString) => {
        try {
            const tripleCount = await rdf.importFromTurtle(turtleString)

            console.log('Imported triples:', tripleCount)
            console.log('Current store size:', rdf.store.value.length)

            // Parse the RDF to extract annotation summaries
            parseImportedAnnotations(turtleString)

            return tripleCount
        } catch (error) {
            console.error('Error importing RDF:', error)
            throw error
        }
    }

    const parseImportedAnnotations = (turtleString) => {
        // Extract variable URIs and create summaries
        // Match patterns like #component.variable
        const lines = turtleString.split('\n')
        const processedVars = new Set()

        lines.forEach(line => {
            // Match subject URIs like #component.variable
            const match = line.match(/#([^_\s<>]+)\.([^\s_<>]+)/)
            if (match) {
                const componentName = match[1]
                const variableName = match[2]
                const varKey = `${componentName}.${variableName}`

                if (!processedVars.has(varKey)) {
                    processedVars.add(varKey)

                    // Create a placeholder annotation summary
                    if (!annotations.value[varKey]) {
                        annotations.value[varKey] = []
                    }

                    // Check if this variable already has imported annotations
                    const hasImported = annotations.value[varKey].some(a => a.type === 'Imported')

                    if (!hasImported) {
                        // Add a generic imported annotation marker
                        annotations.value[varKey].push({
                            type: 'Imported',
                            domain: 'Loaded from file',
                            details: [
                                { label: 'Status', value: 'Loaded from RDF file' },
                                { label: 'Variable', value: `${componentName}.${variableName}` }
                            ]
                        })
                    }
                }
            }
        })

        console.log(`Parsed annotations for ${processedVars.size} variables`)
        console.log('Annotations object:', annotations.value)
    }

    const clearAllAnnotations = () => {
        annotations.value = {}
        rdf.clearAnnotations()
    }

    return {
        selectedVariable,
        currentAnnotations,
        selectVariable,
        addAnnotation,
        exportRDF,
        importRDF,
        clearAllAnnotations,
        getAnnotationCount: () => rdf.getAnnotationCount(),
        annotations
    }
}