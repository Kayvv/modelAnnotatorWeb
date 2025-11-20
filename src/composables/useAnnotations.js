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

    const importRDF = async (turtleString, model) => {
        try {
            const tripleCount = await rdf.importFromTurtle(turtleString)

            console.log('Imported triples:', tripleCount)
            console.log('Current store size:', rdf.store.value.length)

            // Parse with model context to match variables
            await parseImportedAnnotationsWithModel(turtleString, model)

            return tripleCount
        } catch (error) {
            console.error('Error importing RDF:', error)
            throw error
        }
    }

    const parseImportedAnnotationsWithModel = async (turtleString, model) => {
        if (!model) {
            console.warn('No model provided for annotation matching')
            return
        }

        const { Parser } = await import('n3')
        const parser = new Parser()

        // Get all variables from the model
        const modelVariables = new Map()
        const componentCount = model.componentCount()

        for (let i = 0; i < componentCount; i++) {
            const component = model.componentByIndex(i)
            const componentName = component.name()
            const varCount = component.variableCount()

            for (let j = 0; j < varCount; j++) {
                const variable = component.variableByIndex(j)
                const variableName = variable.name()
                const varKey = `${componentName}.${variableName}`

                modelVariables.set(varKey, {
                    component: componentName,
                    variable: variableName,
                    fullKey: varKey
                })
            }
        }

        console.log('Model variables found:', Array.from(modelVariables.keys()))

        // Parse RDF triples
        return new Promise((resolve) => {
            const triplesByVariable = new Map()

            parser.parse(turtleString, (error, quad) => {
                if (error) {
                    console.error('Parse error:', error)
                    return
                }

                if (quad) {
                    const subject = quad.subject.value
                    const predicate = quad.predicate.value
                    const object = quad.object.value

                    const varMatch = subject.match(/#([^#]+?)\.([^#]+?)(?:_annotation|_process|_potential|_force|_source|_sink|_mediator|_target|$)/)

                    if (varMatch) {
                        const componentName = varMatch[1]
                        const variableName = varMatch[2]
                        const varKey = `${componentName}.${variableName}`

                        console.log('Extracted variable key:', varKey, 'from subject:', subject)

                        // Only process if this variable exists in the model
                        if (modelVariables.has(varKey)) {
                            if (!triplesByVariable.has(varKey)) {
                                triplesByVariable.set(varKey, [])
                            }

                            triplesByVariable.get(varKey).push({
                                subject,
                                predicate,
                                object,
                                objectType: quad.object.termType // 'NamedNode' or 'Literal'
                            })
                        } else {
                            console.log('Variable not found in model:', varKey)
                        }
                    }
                } else {
                    // Parsing complete
                    console.log('Matched variables from RDF:', Array.from(triplesByVariable.keys()))

                    // Process matched triples
                    triplesByVariable.forEach((triples, varKey) => {
                        processVariableTriples(varKey, triples)
                    })

                    resolve()
                }
            })
        })
    }

    const processVariableTriples = (varKey, triples) => {
        console.log(`Processing ${triples.length} triples for ${varKey}`)

        const predicates = {}

        // Ontology prefix mappings
        const ontologyPatterns = [
            { regex: /chebi[:/]+(CHEBI:)?(\d+)/i, prefix: 'CHEBI' },
            { regex: /GO[_:](\d{7})/i, prefix: 'GO' },
            { regex: /fma[/#]+(?:fma[_:])?(\d+)/i, prefix: 'FMA' },
            { regex: /UBERON[_:](\d+)/i, prefix: 'UBERON' },
            { regex: /opb[/#]+(?:OPB[_:])?(\d+)/i, prefix: 'OPB' },
            { regex: /pr[/#]+(?:PR[_:])?(\d+)/i, prefix: 'PR' },
            { regex: /uniprot[/#]+([A-Z0-9]{6,10})/i, prefix: '' }, // UniProt has no prefix
            { regex: /sbo[/#]+(?:SBO[_:])?(\d+)/i, prefix: 'SBO' }
        ]

        const extractOntologyTerm = (objValue) => {
            for (const pattern of ontologyPatterns) {
                const match = objValue.match(pattern.regex)
                if (match) {
                    const id = match[match.length - 1] // Get last capture group
                    return pattern.prefix ? `${pattern.prefix}:${id}` : id
                }
            }
            // If no pattern matches, return the last part after # or /
            return objValue.split(/[/#]/).pop()
        }

        triples.forEach(triple => {
            const predName = triple.predicate.split(/[/#]/).pop()

            if (!predicates[predName]) {
                predicates[predName] = []
            }

            const objValue = extractOntologyTerm(triple.object)
            predicates[predName].push(objValue)
        })

        console.log('Extracted predicates for', varKey, ':', predicates)

        // Determine annotation type and domain
        let annotationType = 'Imported'
        let domain = 'Unknown'
        const details = []

        // Check for physical entity (Quantities)
        if (predicates.hasPhysicalEntityReference || predicates.is) {
            annotationType = 'Quantities'

            if (predicates.is) {
                const entities = predicates.is.filter(e => e.includes(':')).join(', ')
                if (entities.includes('CHEBI')) {
                    domain = 'Biochemistry'
                    details.push({ label: 'Species', value: entities })
                } else if (entities.includes('FMA') || entities.includes('fma')) {
                    domain = 'Fluid dynamics'
                    details.push({ label: 'Fluid', value: entities })
                }
            }
        }

        // Check for physical process (Flow rates)
        if (predicates.hasPhysicalProcessReference) {
            annotationType = 'Flow rates'

            // Try to infer domain from species/fluid
            if (predicates.is) {
                const entities = predicates.is.filter(e => e.includes(':')).join(', ')
                if (entities.includes('CHEBI')) {
                    domain = 'Biochemistry'
                } else if (entities.includes('FMA')) {
                    domain = 'Fluid dynamics'
                }
            }

            if (predicates.hasSourceParticipant) {
                details.push({ label: 'Source', value: 'Defined' })
            }
            if (predicates.hasSinkParticipant) {
                details.push({ label: 'Sink', value: 'Defined' })
            }
            if (predicates.hasMediatorParticipant) {
                details.push({ label: 'Mediator', value: 'Defined' })
            }
        }

        // Check for physical force (Efforts)
        if (predicates.hasPhysicalForceReference) {
            annotationType = 'Efforts'

            // Try to infer domain
            if (predicates.is) {
                const entities = predicates.is.filter(e => e.includes(':')).join(', ')
                if (entities.includes('CHEBI')) {
                    domain = 'Biochemistry'
                } else if (entities.includes('FMA')) {
                    domain = 'Fluid dynamics'
                }
            }

            if (predicates.hasSource) {
                details.push({ label: 'Source', value: 'Defined' })
            }
            if (predicates.hasTarget) {
                details.push({ label: 'Target', value: 'Defined' })
            }
        }

        // Add compartment info
        if (predicates.isPartOf) {
            const compartments = predicates.isPartOf.filter(c => c.includes(':')).join(', ')
            if (compartments) {
                details.push({ label: 'Compartment', value: compartments })
            }
        }

        // Add physical property
        if (predicates.isPropertyOf) {
            const properties = predicates.isPropertyOf.filter(p => p.includes(':')).join(', ')
            if (properties) {
                details.push({ label: 'Physical Property', value: properties })
            }
        }

        // Create annotation summary
        if (!annotations.value[varKey]) {
            annotations.value[varKey] = []
        }

        // Remove any existing imported annotations for this variable
        annotations.value[varKey] = annotations.value[varKey].filter(a => a.type !== 'Imported' && a.type !== annotationType)

        // Add new annotation
        annotations.value[varKey].push({
            type: annotationType,
            domain: domain,
            details: details.length > 0 ? details : [
                { label: 'Status', value: 'Imported from RDF' },
                { label: 'Triples', value: `${triples.length} triples found` }
            ]
        })

        console.log(`Added annotation for ${varKey}:`, annotations.value[varKey])
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