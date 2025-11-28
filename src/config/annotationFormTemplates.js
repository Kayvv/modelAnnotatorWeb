export const biochemistryTemplates = {
    Quantities: {
        displayName: "Biochemical Quantity",
        description: "For concentrations, amounts of molecules",
        domain: "Biochemistry",
        qualifier: "bqbiol:isPropertyOf",
        fields: [
            {
                id: "species",
                label: "Species/Molecule",
                type: "ontology-search",
                required: true,
                ontology: "CHEBI",
                placeholder: "e.g., CHEBI:17234 (glucose)",
                helpText: "Search ChEBI for chemical entities",
                searchUrl: "https://www.ebi.ac.uk/chebi/searchId.do?chebiId=",
                validatePattern: /^CHEBI:\d+$/
            },
            {
                id: "compartment",
                label: "Compartment/Location",
                type: "ontology-search",
                required: true,
                ontology: "GO",
                placeholder: "e.g., GO:0005829 (cytosol)",
                helpText: "Search GO for cellular components",
                searchUrl: "https://www.ebi.ac.uk/QuickGO/term/",
                validatePattern: /^GO:\d{7}$/,
            },
            {
                id: "physicalProperty",
                label: "Physical Property (OPB)",
                type: "ontology-search",
                required: true,
                ontology: "OPB",
                placeholder: "e.g., OPB:00425 (chemical concentration)",
                helpText: "Search OPB for physical properties",
                searchUrl: "http://identifiers.org/opb/",
                validatePattern: /^OPB:\d+$/,
            }
        ]
    },

    "Flow rates": {
        displayName: "Biochemical Flow Rate",
        description: "For molecular fluxes and transport processes",
        domain: "Biochemistry",
        qualifier: "bqbiol:isPropertyOf",
        fields: [
            {
                id: "source",
                label: "Source",
                type: "composite",
                required: true,
                subfields: [
                    {
                        id: "species",
                        label: "Species",
                        type: "ontology-search",
                        ontology: "CHEBI",
                        placeholder: "e.g., CHEBI:17234",
                        validatePattern: /^CHEBI:\d+$/
                    },
                    {
                        id: "compartment",
                        label: "Compartment",
                        type: "ontology-search",
                        ontology: "GO",
                        placeholder: "e.g., GO:0005615",
                        validatePattern: /^GO:\d{7}$/
                    },
                    {
                        id: "multiplier",
                        label: "Stoichiometric Coefficient",
                        type: "number",
                        placeholder: "e.g., 1",
                        defaultValue: 1,
                        helpText: "Chemical stoichiometry (usually 1)"
                    }
                ]
            },
            {
                id: "sink",
                label: "Sink",
                type: "composite",
                required: true,
                subfields: [
                    {
                        id: "species",
                        label: "Species",
                        type: "ontology-search",
                        ontology: "CHEBI",
                        placeholder: "e.g., CHEBI:17234",
                        validatePattern: /^CHEBI:\d+$/
                    },
                    {
                        id: "compartment",
                        label: "Compartment",
                        type: "ontology-search",
                        ontology: "GO",
                        placeholder: "e.g., GO:0005829",
                        validatePattern: /^GO:\d{7}$/
                    },
                    {
                        id: "multiplier",
                        label: "Stoichiometric Coefficient",
                        type: "number",
                        placeholder: "e.g., 1",
                        defaultValue: 1
                    }
                ]
            },
            {
                id: "mediator",
                label: "Mediator (Optional)",
                type: "composite",
                required: false,
                subfields: [
                    {
                        id: "protein",
                        label: "Protein",
                        type: "ontology-search",
                        ontology: "PR/UNIPROT",
                        placeholder: "e.g., PR:000007235 (GLUT2) or P14672",
                        helpText: "Search Protein Ontology or UniProt",
                        validatePattern: /^(PR:\d+|[A-Z0-9]{6,10})$/,
                        searchUrl: "https://www.uniprot.org/uniprotkb/"
                    },
                    {
                        id: "compartment",
                        label: "Compartment",
                        type: "ontology-search",
                        ontology: "GO",
                        placeholder: "e.g., GO:0005886 (plasma membrane)",
                        validatePattern: /^GO:\d{7}$/
                    }
                ]
            },
            {
                id: "bioprocess",
                label: "Biological Process/Activity",
                type: "ontology-search",
                required: true,
                ontology: "GO_BP/SBO",
                placeholder: "e.g., GO:0046323 (glucose import)",
                helpText: "Use GO biological process or SBO terms",
                validatePattern: /^(GO:\d{7}|SBO:\d{7})$/,
                searchUrl: "https://www.ebi.ac.uk/QuickGO/term/"
            },
            {
                id: "physicalProperty",
                label: "Physical Property (OPB)",
                type: "ontology-search",
                required: true,
                ontology: "OPB",
                placeholder: "e.g., OPB:00592 (chemical flux)",
                searchUrl: "http://identifiers.org/opb/",
                validatePattern: /^OPB:\d+$/,
            }
        ]
    },

    Efforts: {
        displayName: "Biochemical Potential",
        description: "For chemical and electrical potentials",
        domain: "Biochemistry",
        qualifier: "bqbiol:isPropertyOf",
        fields: [
            {
                id: "source",
                label: "Source",
                type: "composite",
                required: true,
                subfields: [
                    {
                        id: "species",
                        label: "Species",
                        type: "ontology-search",
                        ontology: "CHEBI",
                        placeholder: "e.g., CHEBI:29101 (Na+)",
                        validatePattern: /^CHEBI:\d+$/
                    },
                    {
                        id: "compartment",
                        label: "Compartment",
                        type: "ontology-search",
                        ontology: "GO",
                        placeholder: "e.g., GO:0005615 (extracellular space)",
                        validatePattern: /^GO:\d{7}$/
                    }
                ]
            },
            {
                id: "target",
                label: "Sink",
                type: "composite",
                required: true,
                subfields: [
                    {
                        id: "species",
                        label: "Species",
                        type: "ontology-search",
                        ontology: "CHEBI",
                        placeholder: "e.g., CHEBI:29101 (Na+)",
                        validatePattern: /^CHEBI:\d+$/
                    },
                    {
                        id: "compartment",
                        label: "Compartment",
                        type: "ontology-search",
                        ontology: "GO",
                        placeholder: "e.g., GO:0005829 (cytosol)",
                        validatePattern: /^GO:\d{7}$/
                    }
                ]
            },
            {
                id: "physicalProperty",
                label: "Physical Property (OPB)",
                type: "ontology-search",
                required: true,
                ontology: "OPB",
                placeholder: "e.g., OPB:00506 (electrical potential difference)",
                searchUrl: "http://identifiers.org/opb/",
                validatePattern: /^OPB:\d+$/
            }
        ]
    }
}

export const fluidDynamicsTemplates = {
    Quantities: {
        displayName: "Fluid Quantity",
        description: "For volumes and fluid amounts",
        domain: "Fluid dynamics",
        qualifier: "bqbiol:isPropertyOf",
        fields: [
            {
                id: "fluid",
                label: "Portion of Body Fluid",
                type: "ontology-search",
                required: true,
                ontology: "FMA",
                placeholder: "e.g., FMA:280556 (portion of body fluid)",
                helpText: "Search FMA for body fluid types",
                searchUrl: "https://bioportal.bioontology.org/ontologies/FMA?p=classes&conceptid=",
                validatePattern: /^FMA:\d+$/
            },
            {
                id: "compartment",
                label: "Compartment/Location",
                type: "ontology-search",
                required: true,
                ontology: "FMA/UBERON",
                placeholder: "e.g., FMA:7088 (blood vessel)",
                helpText: "Search FMA or UBERON for anatomical structures",
                searchUrl: "https://bioportal.bioontology.org/ontologies/FMA?p=classes&conceptid=",
                validatePattern: /^(FMA:\d+|UBERON:\d{7})$/
            },
            {
                id: "physicalProperty",
                label: "Physical Property (OPB)",
                type: "ontology-search",
                required: true,
                ontology: "OPB",
                placeholder: "e.g., OPB:00154 (volume)",
                searchUrl: "http://identifiers.org/opb/",
                validatePattern: /^OPB:\d+$/,
            }
        ]
    },

    "Flow rates": {
        displayName: "Fluid Flow Rate",
        description: "For fluid flows and transport",
        domain: "Fluid dynamics",
        qualifier: "bqbiol:isPropertyOf",
        fields: [
            {
                id: "source",
                label: "Source",
                type: "composite",
                required: true,
                subfields: [
                    {
                        id: "fluid",
                        label: "Fluid Type",
                        type: "ontology-search",
                        ontology: "FMA",
                        placeholder: "e.g., FMA:9670 (blood)",
                        validatePattern: /^FMA:\d+$/
                    },
                    {
                        id: "compartment",
                        label: "Compartment",
                        type: "ontology-search",
                        ontology: "FMA/UBERON",
                        placeholder: "e.g., FMA:50723 (artery)",
                        validatePattern: /^(FMA:\d+|UBERON:\d{7})$/
                    },
                    {
                        id: "multiplier",
                        label: "Multiplier",
                        type: "number",
                        placeholder: "e.g., 1",
                        defaultValue: 1
                    }
                ]
            },
            {
                id: "sink",
                label: "Sink",
                type: "composite",
                required: true,
                subfields: [
                    {
                        id: "fluid",
                        label: "Fluid Type",
                        type: "ontology-search",
                        ontology: "FMA",
                        placeholder: "e.g., FMA:9670 (blood)",
                        validatePattern: /^FMA:\d+$/
                    },
                    {
                        id: "compartment",
                        label: "Compartment",
                        type: "ontology-search",
                        ontology: "FMA/UBERON",
                        placeholder: "e.g., FMA:50724 (vein)",
                        validatePattern: /^(FMA:\d+|UBERON:\d{7})$/
                    },
                    {
                        id: "multiplier",
                        label: "Multiplier",
                        type: "number",
                        placeholder: "e.g., 1",
                        defaultValue: 1
                    }
                ]
            },
            {
                id: "mediator",
                label: "Mediator (Optional)",
                type: "composite",
                required: false,
                subfields: [
                    {
                        id: "protein",
                        label: "Protein/Structure",
                        type: "ontology-search",
                        ontology: "PR/FMA",
                        placeholder: "e.g., PR:000001234 or FMA term",
                        validatePattern: /^(PR:\d+|FMA:\d+)$/
                    },
                    {
                        id: "compartment",
                        label: "Compartment",
                        type: "ontology-search",
                        ontology: "FMA/UBERON",
                        placeholder: "e.g., FMA:63842 (endothelium)",
                        validatePattern: /^(FMA:\d+|UBERON:\d{7})$/
                    }
                ]
            },
            {
                id: "physicalProperty",
                label: "Physical Property (OPB)",
                type: "ontology-search",
                required: true,
                ontology: "OPB",
                placeholder: "e.g., OPB:00593 (fluid flow rate)",
                searchUrl: "http://identifiers.org/opb/",
                validatePattern: /^OPB:\d+$/,
            }
        ]
    },

    Efforts: {
        displayName: "Fluid Pressure/Force",
        description: "For pressures and mechanical forces",
        domain: "Fluid dynamics",
        qualifier: "bqbiol:isPropertyOf",
        fields: [
            {
                id: "source",
                label: "Source Location",
                type: "composite",
                required: true,
                subfields: [
                    {
                        id: "location",
                        label: "Anatomical Location",
                        type: "ontology-search",
                        ontology: "FMA/UBERON",
                        placeholder: "e.g., FMA:50723 (artery)",
                        validatePattern: /^(FMA:\d+|UBERON:\d{7})$/
                    }
                ]
            },
            {
                id: "target",
                label: "Sink Location",
                type: "composite",
                required: true,
                subfields: [
                    {
                        id: "location",
                        label: "Anatomical Location",
                        type: "ontology-search",
                        ontology: "FMA/UBERON",
                        placeholder: "e.g., FMA:50724 (vein)",
                        validatePattern: /^(FMA:\d+|UBERON:\d{7})$/
                    }
                ]
            },
            {
                id: "physicalProperty",
                label: "Physical Property (OPB)",
                type: "ontology-search",
                required: true,
                ontology: "OPB",
                placeholder: "e.g., OPB:00509 (pressure)",
                searchUrl: "http://identifiers.org/opb/",
                validatePattern: /^OPB:\d+$/,
            }
        ]
    }
}

// Helper function to deep clone template while preserving RegExp
function deepCloneTemplate(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    // Handle RegExp
    if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags)
    }

    // Handle Array
    if (Array.isArray(obj)) {
        return obj.map(item => deepCloneTemplate(item))
    }

    // Handle Object
    const cloned = {}
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepCloneTemplate(obj[key])
        }
    }

    return cloned
}

export function getTemplateForVariable(domain, annotationType, userOntologies) {
    console.log('Getting template for:', { domain, annotationType })

    if (!annotationType) {
        return null
    }

    let templates
    if (domain === 'Biochemistry') {
        templates = biochemistryTemplates
    } else if (domain === 'Fluid dynamics') {
        templates = fluidDynamicsTemplates
    } else {
        console.warn('Unknown domain, using Biochemistry templates')
        templates = biochemistryTemplates
    }

    const template = templates[annotationType]

    if (!template) {
        console.error(`No template found for annotationType: ${annotationType}`)
        return null
    }

    // Use custom deep clone to preserve RegExp
    const clonedTemplate = deepCloneTemplate(template)

    // Inject user-selected common terms
    if (userOntologies) {
        injectCommonTerms(clonedTemplate.fields, userOntologies)
    }

    console.log('Selected template:', clonedTemplate.displayName)
    return clonedTemplate
}

// Recursive function to inject common terms into fields
function injectCommonTerms(fields, userOntologies) {
    fields.forEach(field => {
        if (field.type === 'composite' && field.subfields) {
            injectCommonTerms(field.subfields, userOntologies)
        } else if (field.type === 'ontology-search' && field.ontology) {
            // Handle multiple ontologies (e.g., "PR/UNIPROT" or "GO_BP/SBO")
            const ontologies = field.ontology.split('/')

            let combinedTerms = []
            ontologies.forEach(ontId => {
                const cleanOntId = ontId.trim()
                const ontology = userOntologies[cleanOntId] || userOntologies[cleanOntId.toUpperCase()]
                if (ontology && ontology.commonTerms) {
                    combinedTerms = combinedTerms.concat(ontology.commonTerms)
                }
            })

            if (combinedTerms.length > 0) {
                field.commonTerms = combinedTerms
            }
        }
    })
}

export function getTemplatesForDomain(domain) {
    if (domain === 'Biochemistry') {
        return biochemistryTemplates
    } else if (domain === 'Fluid dynamics') {
        return fluidDynamicsTemplates
    }
    return biochemistryTemplates
}