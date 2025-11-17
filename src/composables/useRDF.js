import { ref } from 'vue'
import { Writer, DataFactory } from 'n3'
const { namedNode, literal, quad } = DataFactory

export function useRDF() {
    const store = ref([])
    const usedNamespaces = ref(new Set())

    const namespaces = {
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        dc: 'http://purl.org/dc/terms/',
        bqbiol: 'http://biomodels.net/biology-qualifiers/',
        bqmodel: 'http://biomodels.net/model-qualifiers/',
        semsim: 'http://www.bhi.washington.edu/semsim#',

        chebi: 'http://identifiers.org/chebi/',
        go: 'http://identifiers.org/go/',
        pr: 'http://identifiers.org/pr/',
        fma: 'http://purl.org/sig/ont/fma/',
        uberon: 'http://purl.obolibrary.org/obo/UBERON_',
        opb: 'http://identifiers.org/opb/',
        sbo: 'http://identifiers.org/sbo/',
        uniprot: 'http://identifiers.org/uniprot/'
    }

    const removeAnnotationsForVariable = (variableURI) => {
        // Find and remove all triples related to this variable
        const toRemove = []

        store.value.forEach((triple, index) => {
            const subject = triple.subject.value

            // Remove direct annotations
            if (subject === variableURI) {
                toRemove.push(index)
            }

            // Remove composite/process/force nodes related to this variable
            if (subject.startsWith(variableURI + '_')) {
                toRemove.push(index)
            }

            // Also check if this triple references the variable as object
            const object = triple.object.value
            if (object === variableURI || object.startsWith(variableURI + '_')) {
                toRemove.push(index)
            }
        })

        // Remove in reverse order to maintain indices
        toRemove.sort((a, b) => b - a)
        toRemove.forEach(index => {
            store.value.splice(index, 1)
        })

        console.log(`Removed ${toRemove.length} triples for ${variableURI}`)
    }

    const createURI = (prefix, id) => {
        if (id.includes(':')) {
            const [ns, localId] = id.split(':')
            const namespace = namespaces[ns.toLowerCase()]
            if (namespace) {
                usedNamespaces.value.add(ns.toLowerCase())
                return namespace + localId
            }
        }
        usedNamespaces.value.add(prefix)
        return namespaces[prefix] + id
    }

    const createVariableURI = (modelName, componentName, variableName) => {
        return `#${componentName}.${variableName}`
    }

    const createSingularAnnotation = (subject, predicate, object) => {
        const subjectNode = namedNode(subject)
        const predicateNode = namedNode(predicate)
        const objectNode = namedNode(object)

        const extractNamespace = (uri) => {
            for (const [prefix, namespace] of Object.entries(namespaces)) {
                if (uri.startsWith(namespace)) {
                    usedNamespaces.value.add(prefix)
                    return
                }
            }
        }

        extractNamespace(predicate)
        extractNamespace(object)
        if (!subject.startsWith('#')) {
            extractNamespace(subject)
        }

        const triple = quad(subjectNode, predicateNode, objectNode)
        store.value.push(triple)

        return triple
    }

    const createBiochemistryQuantityAnnotation = (variableInfo, annotationData) => {
        const { modelName, component, variable } = variableInfo
        const { species, compartment, physicalProperty } = annotationData

        const variableURI = createVariableURI(modelName, component.name, variable.name)

        const compositeNode = `${variableURI}_annotation`

        createSingularAnnotation(
            compositeNode,
            namespaces.rdf + 'type',
            namespaces.semsim + 'CompositePhysicalEntity'
        )

        createSingularAnnotation(
            variableURI,
            namespaces.semsim + 'hasPhysicalEntityReference',
            compositeNode
        )

        if (species) {
            const speciesURI = createURI('chebi', species)
            createSingularAnnotation(
                compositeNode,
                namespaces.bqbiol + 'is',
                speciesURI
            )
        }

        if (compartment) {
            const compartmentURI = createURI('go', compartment)
            createSingularAnnotation(
                compositeNode,
                namespaces.bqbiol + 'isPartOf',
                compartmentURI
            )
        }

        if (physicalProperty) {
            const opbURI = createURI('opb', physicalProperty)
            createSingularAnnotation(
                variableURI,
                namespaces.bqbiol + 'isPropertyOf',
                opbURI
            )
        }

        return compositeNode
    }

    const createBiochemistryFlowRateAnnotation = (variableInfo, annotationData) => {
        const { modelName, component, variable } = variableInfo
        const { source, sink, mediator, bioprocess, physicalProperty } = annotationData

        const variableURI = createVariableURI(modelName, component.name, variable.name)
        const processNode = `${variableURI}_process`

        createSingularAnnotation(
            processNode,
            namespaces.rdf + 'type',
            namespaces.semsim + 'PhysicalProcess'
        )

        createSingularAnnotation(
            variableURI,
            namespaces.semsim + 'hasPhysicalProcessReference',
            processNode
        )

        if (source) {
            const sourceNode = `${processNode}_source`
            createSingularAnnotation(
                processNode,
                namespaces.semsim + 'hasSourceParticipant',
                sourceNode
            )

            // Source species
            if (source.species) {
                const speciesURI = createURI('chebi', source.species)
                createSingularAnnotation(
                    sourceNode,
                    namespaces.bqbiol + 'is',
                    speciesURI
                )
            }

            // Source compartment
            if (source.compartment) {
                const compartmentURI = createURI('go', source.compartment)
                createSingularAnnotation(
                    sourceNode,
                    namespaces.bqbiol + 'isPartOf',
                    compartmentURI
                )
            }

            // Source multiplier (stoichiometry)
            if (source.multiplier) {
                const multiplierNode = namedNode(sourceNode)
                const multiplierValue = literal(source.multiplier.toString())
                store.value.push(
                    quad(
                        multiplierNode,
                        namedNode(namespaces.semsim + 'hasMultiplier'),
                        multiplierValue
                    )
                )
            }
        }

        if (sink) {
            const sinkNode = `${processNode}_sink`
            createSingularAnnotation(
                processNode,
                namespaces.semsim + 'hasSinkParticipant',
                sinkNode
            )

            // Sink species
            if (sink.species) {
                const speciesURI = createURI('chebi', sink.species)
                createSingularAnnotation(
                    sinkNode,
                    namespaces.bqbiol + 'is',
                    speciesURI
                )
            }

            // Sink compartment
            if (sink.compartment) {
                const compartmentURI = createURI('go', sink.compartment)
                createSingularAnnotation(
                    sinkNode,
                    namespaces.bqbiol + 'isPartOf',
                    compartmentURI
                )
            }

            // Sink multiplier
            if (sink.multiplier) {
                const multiplierNode = namedNode(sinkNode)
                const multiplierValue = literal(sink.multiplier.toString())
                store.value.push(
                    quad(
                        multiplierNode,
                        namedNode(namespaces.semsim + 'hasMultiplier'),
                        multiplierValue
                    )
                )
            }
        }

        // Add Mediator
        if (mediator && mediator.protein) {
            const mediatorNode = `${processNode}_mediator`
            createSingularAnnotation(
                processNode,
                namespaces.semsim + 'hasMediatorParticipant',
                mediatorNode
            )

            // Mediator protein
            let proteinURI
            if (mediator.protein.startsWith('PR:')) {
                proteinURI = createURI('pr', mediator.protein)
            } else {
                proteinURI = createURI('uniprot', mediator.protein)
            }
            createSingularAnnotation(
                mediatorNode,
                namespaces.bqbiol + 'is',
                proteinURI
            )

            // Mediator compartment
            if (mediator.compartment) {
                const compartmentURI = createURI('go', mediator.compartment)
                createSingularAnnotation(
                    mediatorNode,
                    namespaces.bqbiol + 'isPartOf',
                    compartmentURI
                )
            }
        }

        if (bioprocess) {
            let bioprocessURI
            if (bioprocess.startsWith('SBO:')) {
                bioprocessURI = createURI('sbo', bioprocess)
            } else {
                bioprocessURI = createURI('go', bioprocess)
            }
            createSingularAnnotation(
                processNode,
                namespaces.bqbiol + 'is',
                bioprocessURI
            )
        }

        if (physicalProperty) {
            const opbURI = createURI('opb', physicalProperty)
            createSingularAnnotation(
                variableURI,
                namespaces.bqbiol + 'isPropertyOf',
                opbURI
            )
        }

        return processNode
    }

    const createBiochemistryEffortAnnotation = (variableInfo, annotationData) => {
        const { modelName, component, variable } = variableInfo
        const { source, target, physicalProperty } = annotationData

        const variableURI = createVariableURI(modelName, component.name, variable.name)
        const potentialNode = `${variableURI}_potential`

        createSingularAnnotation(
            potentialNode,
            namespaces.rdf + 'type',
            namespaces.semsim + 'PhysicalForce'
        )

        createSingularAnnotation(
            variableURI,
            namespaces.semsim + 'hasPhysicalForceReference',
            potentialNode
        )

        if (source) {
            const sourceNode = `${potentialNode}_source`
            createSingularAnnotation(
                potentialNode,
                namespaces.semsim + 'hasSource',
                sourceNode
            )

            if (source.species) {
                const speciesURI = createURI('chebi', source.species)
                createSingularAnnotation(
                    sourceNode,
                    namespaces.bqbiol + 'is',
                    speciesURI
                )
            }

            if (source.compartment) {
                const compartmentURI = createURI('go', source.compartment)
                createSingularAnnotation(
                    sourceNode,
                    namespaces.bqbiol + 'isPartOf',
                    compartmentURI
                )
            }
        }

        if (target) {
            const targetNode = `${potentialNode}_target`
            createSingularAnnotation(
                potentialNode,
                namespaces.semsim + 'hasTarget',
                targetNode
            )

            if (target.species) {
                const speciesURI = createURI('chebi', target.species)
                createSingularAnnotation(
                    targetNode,
                    namespaces.bqbiol + 'is',
                    speciesURI
                )
            }

            if (target.compartment) {
                const compartmentURI = createURI('go', target.compartment)
                createSingularAnnotation(
                    targetNode,
                    namespaces.bqbiol + 'isPartOf',
                    compartmentURI
                )
            }
        }

        if (physicalProperty) {
            const opbURI = createURI('opb', physicalProperty)
            createSingularAnnotation(
                variableURI,
                namespaces.bqbiol + 'isPropertyOf',
                opbURI
            )
        }

        return potentialNode
    }

    const createFluidDynamicsQuantityAnnotation = (variableInfo, annotationData) => {
        const { modelName, component, variable } = variableInfo
        const { fluid, compartment, physicalProperty } = annotationData

        const variableURI = createVariableURI(modelName, component.name, variable.name)
        const compositeNode = `${variableURI}_annotation`

        createSingularAnnotation(
            compositeNode,
            namespaces.rdf + 'type',
            namespaces.semsim + 'CompositePhysicalEntity'
        )

        createSingularAnnotation(
            variableURI,
            namespaces.semsim + 'hasPhysicalEntityReference',
            compositeNode
        )

        if (fluid) {
            const fluidURI = createURI('fma', fluid)
            createSingularAnnotation(
                compositeNode,
                namespaces.bqbiol + 'is',
                fluidURI
            )
        }

        if (compartment) {
            let compartmentURI
            if (compartment.startsWith('UBERON:')) {
                compartmentURI = createURI('uberon', compartment)
            } else {
                compartmentURI = createURI('fma', compartment)
            }
            createSingularAnnotation(
                compositeNode,
                namespaces.bqbiol + 'isPartOf',
                compartmentURI
            )
        }

        if (physicalProperty) {
            const opbURI = createURI('opb', physicalProperty)
            createSingularAnnotation(
                variableURI,
                namespaces.bqbiol + 'isPropertyOf',
                opbURI
            )
        }

        return compositeNode
    }

    const createFluidDynamicsFlowRateAnnotation = (variableInfo, annotationData) => {
        const { modelName, component, variable } = variableInfo
        const { source, sink, mediator, physicalProperty } = annotationData

        const variableURI = createVariableURI(modelName, component.name, variable.name)
        const processNode = `${variableURI}_process`

        createSingularAnnotation(
            processNode,
            namespaces.rdf + 'type',
            namespaces.semsim + 'PhysicalProcess'
        )

        createSingularAnnotation(
            variableURI,
            namespaces.semsim + 'hasPhysicalProcessReference',
            processNode
        )

        // Source
        if (source) {
            const sourceNode = `${processNode}_source`
            createSingularAnnotation(
                processNode,
                namespaces.semsim + 'hasSourceParticipant',
                sourceNode
            )

            if (source.fluid) {
                const fluidURI = createURI('fma', source.fluid)
                createSingularAnnotation(
                    sourceNode,
                    namespaces.bqbiol + 'is',
                    fluidURI
                )
            }

            if (source.compartment) {
                let compartmentURI
                if (source.compartment.startsWith('UBERON:')) {
                    compartmentURI = createURI('uberon', source.compartment)
                } else {
                    compartmentURI = createURI('fma', source.compartment)
                }
                createSingularAnnotation(
                    sourceNode,
                    namespaces.bqbiol + 'isPartOf',
                    compartmentURI
                )
            }

            if (source.multiplier) {
                const multiplierNode = namedNode(sourceNode)
                const multiplierValue = literal(source.multiplier.toString())
                store.value.push(
                    quad(
                        multiplierNode,
                        namedNode(namespaces.semsim + 'hasMultiplier'),
                        multiplierValue
                    )
                )
            }
        }

        // Sink
        if (sink) {
            const sinkNode = `${processNode}_sink`
            createSingularAnnotation(
                processNode,
                namespaces.semsim + 'hasSinkParticipant',
                sinkNode
            )

            if (sink.fluid) {
                const fluidURI = createURI('fma', sink.fluid)
                createSingularAnnotation(
                    sinkNode,
                    namespaces.bqbiol + 'is',
                    fluidURI
                )
            }

            if (sink.compartment) {
                let compartmentURI
                if (sink.compartment.startsWith('UBERON:')) {
                    compartmentURI = createURI('uberon', sink.compartment)
                } else {
                    compartmentURI = createURI('fma', sink.compartment)
                }
                createSingularAnnotation(
                    sinkNode,
                    namespaces.bqbiol + 'isPartOf',
                    compartmentURI
                )
            }

            if (sink.multiplier) {
                const multiplierNode = namedNode(sinkNode)
                const multiplierValue = literal(sink.multiplier.toString())
                store.value.push(
                    quad(
                        multiplierNode,
                        namedNode(namespaces.semsim + 'hasMultiplier'),
                        multiplierValue
                    )
                )
            }
        }

        // Mediator (optional)
        if (mediator && mediator.protein) {
            const mediatorNode = `${processNode}_mediator`
            createSingularAnnotation(
                processNode,
                namespaces.semsim + 'hasMediatorParticipant',
                mediatorNode
            )

            let proteinURI
            if (mediator.protein.startsWith('PR:')) {
                proteinURI = createURI('pr', mediator.protein)
            } else {
                proteinURI = createURI('fma', mediator.protein)
            }
            createSingularAnnotation(
                mediatorNode,
                namespaces.bqbiol + 'is',
                proteinURI
            )

            if (mediator.compartment) {
                let compartmentURI
                if (mediator.compartment.startsWith('UBERON:')) {
                    compartmentURI = createURI('uberon', mediator.compartment)
                } else {
                    compartmentURI = createURI('fma', mediator.compartment)
                }
                createSingularAnnotation(
                    mediatorNode,
                    namespaces.bqbiol + 'isPartOf',
                    compartmentURI
                )
            }
        }

        if (physicalProperty) {
            const opbURI = createURI('opb', physicalProperty)
            createSingularAnnotation(
                variableURI,
                namespaces.bqbiol + 'isPropertyOf',
                opbURI
            )
        }

        return processNode
    }

    const createFluidDynamicsEffortAnnotation = (variableInfo, annotationData) => {
        const { modelName, component, variable } = variableInfo
        const { source, target, physicalProperty } = annotationData

        const variableURI = createVariableURI(modelName, component.name, variable.name)
        const potentialNode = `${variableURI}_potential`

        createSingularAnnotation(
            potentialNode,
            namespaces.rdf + 'type',
            namespaces.semsim + 'PhysicalForce'
        )

        createSingularAnnotation(
            variableURI,
            namespaces.semsim + 'hasPhysicalForceReference',
            potentialNode
        )

        if (source && source.location) {
            const sourceNode = `${potentialNode}_source`
            createSingularAnnotation(
                potentialNode,
                namespaces.semsim + 'hasSource',
                sourceNode
            )

            let locationURI
            if (source.location.startsWith('UBERON:')) {
                locationURI = createURI('uberon', source.location)
            } else {
                locationURI = createURI('fma', source.location)
            }
            createSingularAnnotation(
                sourceNode,
                namespaces.bqbiol + 'is',
                locationURI
            )
        }

        if (target && target.location) {
            const targetNode = `${potentialNode}_target`
            createSingularAnnotation(
                potentialNode,
                namespaces.semsim + 'hasTarget',
                targetNode
            )

            let locationURI
            if (target.location.startsWith('UBERON:')) {
                locationURI = createURI('uberon', target.location)
            } else {
                locationURI = createURI('fma', target.location)
            }
            createSingularAnnotation(
                targetNode,
                namespaces.bqbiol + 'is',
                locationURI
            )
        }

        if (physicalProperty) {
            const opbURI = createURI('opb', physicalProperty)
            createSingularAnnotation(
                variableURI,
                namespaces.bqbiol + 'isPropertyOf',
                opbURI
            )
        }

        return potentialNode
    }

    const addAnnotation = (annotation) => {
        const { type, domain, data, variable } = annotation

        const variableInfo = {
            modelName: variable.component.name,
            component: variable.component,
            variable: variable
        }

        if (domain === 'Biochemistry') {
            if (type === 'Quantities') {
                return createBiochemistryQuantityAnnotation(variableInfo, data)
            } else if (type === 'Flow rates') {
                return createBiochemistryFlowRateAnnotation(variableInfo, data)
            } else if (type === 'Efforts') {
                return createBiochemistryEffortAnnotation(variableInfo, data)
            }
        } else if (domain === 'Fluid dynamics') {
            if (type === 'Quantities') {
                return createFluidDynamicsQuantityAnnotation(variableInfo, data)
            } else if (type === 'Flow rates') {
                return createFluidDynamicsFlowRateAnnotation(variableInfo, data)
            } else if (type === 'Efforts') {
                return createFluidDynamicsEffortAnnotation(variableInfo, data)
            }
        }
    }

    const exportToTurtle = () => {
        const usedPrefixes = {}
        const alwaysInclude = ['rdf', 'bqbiol', 'semsim']
        alwaysInclude.forEach(prefix => {
            if (namespaces[prefix]) {
                usedPrefixes[prefix] = namespaces[prefix]
            }
        })

        usedNamespaces.value.forEach(prefix => {
            if (namespaces[prefix]) {
                usedPrefixes[prefix] = namespaces[prefix]
            }
        })

        const writer = new Writer({
            prefixes: usedPrefixes
        })

        writer.addQuads(store.value)

        return new Promise((resolve, reject) => {
            writer.end((error, result) => {
                if (error) reject(error)
                else resolve(result)
            })
        })
    }

    const clearAnnotations = () => {
        store.value = []
        usedNamespaces.value.clear()
    }

    const getAnnotationCount = () => {
        return store.value.length
    }

    return {
        store,
        namespaces,
        addAnnotation,
        exportToTurtle,
        clearAnnotations,
        getAnnotationCount,
        getUsedNamespaces: () => Array.from(usedNamespaces.value),
        removeAnnotationsForVariable
    }
}