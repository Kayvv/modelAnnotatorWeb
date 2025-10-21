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
                ontology: "ChEBI",
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
                commonTerms: [
                    { id: "GO:0005886", label: "plasma membrane" },
                    { id: "GO:0005829", label: "cytosol" },
                    { id: "GO:0005739", label: "mitochondrion" },
                    { id: "GO:0005783", label: "endoplasmic reticulum" },
                    { id: "GO:0005634", label: "nucleus" },
                    { id: "GO:0005615", label: "extracellular space" }
                ]
            },
            {
                id: "physicalProperty",
                label: "Physical Property (OPB)",
                type: "ontology-search",
                required: true,
                ontology: "OPB",
                placeholder: "e.g., OPB:00425 (chemical concentration)",
                helpText: "Search OPB for physical properties",
                searchUrl: "https://bioportal.bioontology.org/ontologies/OPB?p=classes&conceptid=",
                validatePattern: /^OPB:\d+$/,
                commonTerms: [
                    { id: "OPB:00425", label: "chemical concentration" },
                    { id: "OPB:00340", label: "amount of substance" },
                    { id: "OPB:00523", label: "charge density" }
                ]
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
                        ontology: "ChEBI",
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
                        ontology: "ChEBI",
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
                        ontology: "PR/UniProt",
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
                ontology: "GO/SBO",
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
                validatePattern: /^OPB:\d+$/,
                commonTerms: [
                    { id: "OPB:00592", label: "chemical flux" }
                ]
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
                        ontology: "ChEBI",
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
                label: "Target",
                type: "composite",
                required: true,
                subfields: [
                    {
                        id: "species",
                        label: "Species",
                        type: "ontology-search",
                        ontology: "ChEBI",
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
                validatePattern: /^OPB:\d+$/,
                commonTerms: [
                    { id: "OPB:00506", label: "electrical potential difference" },
                    { id: "OPB:00378", label: "chemical potential" }
                ]
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
                validatePattern: /^OPB:\d+$/,
                commonTerms: [
                    { id: "OPB:00154", label: "volume" },
                    { id: "OPB:00340", label: "amount of substance" }
                ]
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
                validatePattern: /^OPB:\d+$/,
                commonTerms: [
                    { id: "OPB:00593", label: "fluid flow rate" },
                    { id: "OPB:01358", label: "volumetric flow rate" }
                ]
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
                label: "Target Location",
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
                validatePattern: /^OPB:\d+$/,
                commonTerms: [
                    { id: "OPB:00509", label: "pressure" },
                    { id: "OPB:01492", label: "pressure difference" }
                ]
            }
        ]
    }
}

export function getTemplatesForDomain(domain) {
    if (domain === 'Biochemistry') {
        return biochemistryTemplates
    } else if (domain === 'Fluid dynamics') {
        return fluidDynamicsTemplates
    }
    return biochemistryTemplates
}