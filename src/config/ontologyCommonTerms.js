export const ontologyCommonTerms = {
    // Biochemistry
    // Compartment/anatomical ontologies
    GO: {
        name: 'Gene Ontology (Cellular Component)',
        terms: [
            { id: 'GO:0005886', label: 'plasma membrane' },
            { id: 'GO:0005829', label: 'cytosol' },
            { id: 'GO:0005739', label: 'mitochondrion' },
            { id: 'GO:0005783', label: 'endoplasmic reticulum' },
            { id: 'GO:0005634', label: 'nucleus' },
            { id: 'GO:0005615', label: 'extracellular space' },
            { id: 'GO:0005768', label: 'endosome' },
            { id: 'GO:0005764', label: 'lysosome' },
            { id: 'GO:0005840', label: 'ribosome' },
            { id: 'GO:0005856', label: 'cytoskeleton' },
            { id: 'GO:0005874', label: 'microtubule' },
            { id: 'GO:0005884', label: 'actin filament' },
            { id: 'GO:0005882', label: 'intermediate filament' },
            { id: 'GO:0031012', label: 'extracellular matrix' }
        ]
    },

    // Species/molecules ontologies
    CHEBI: {
        name: 'Chemical Entities of Biological Interest',
        terms: [
            { id: 'CHEBI:29101', label: 'Na+' },
            { id: 'CHEBI:29103', label: 'K+' },
            { id: 'CHEBI:29108', label: 'Ca2+' },
            { id: 'CHEBI:18420', label: 'Mg2+' },
            { id: 'CHEBI:15378', label: 'H+' },
            { id: 'CHEBI:17996', label: 'Cl-' },
            { id: 'CHEBI:24870', label: 'ion' },
            { id: 'CHEBI:456216', label: 'ADP(3−)' },
            { id: 'CHEBI:30616', label: 'ATP(4−)' },
            { id: 'CHEBI:18367', label: 'phosphate(3−)' },
            { id: 'CHEBI:17234', label: 'glucose' },
            { id: 'CHEBI:17925', label: 'lactate' },
            { id: 'CHEBI:16236', label: 'ethanol' },
            { id: 'CHEBI:15377', label: 'water' },
            { id: 'CHEBI:29985', label: 'glutamate' },
            { id: 'CHEBI:16038', label: 'pyruvate' }
        ]
    },

    // Protein ontologies
    PR: {
        name: 'Protein Ontology',
        terms: [
            { id: 'PR:000007235', label: 'GLUT2 (glucose transporter)' },
            { id: 'PR:000001195', label: 'SGLT1 (sodium-glucose transporter)' },
            { id: 'PR:000015665', label: 'Na+/K+ ATPase' },
            { id: 'PR:000001625', label: 'Ca2+ ATPase' },
            { id: 'PR:000001923', label: 'voltage-gated sodium channel' },
            { id: 'PR:000002066', label: 'voltage-gated potassium channel' },
            { id: 'PR:000001967', label: 'voltage-gated calcium channel' }
        ]
    },

    UNIPROT: {
        name: 'UniProt',
        terms: [
            { id: 'P14672', label: 'SLC2A2 (GLUT2)' },
            { id: 'P13866', label: 'SLC5A1 (SGLT1)' },
            { id: 'P05023', label: 'ATP1A1 (Na+/K+ ATPase alpha-1)' },
            { id: 'P20020', label: 'ATP2B1 (Plasma membrane Ca2+ ATPase)' }
        ]
    },

    // Bioprocess/activity ontology
    GO_BP: {
        name: 'Gene Ontology (Biological Process)',
        terms: [
            { id: 'GO:0006810', label: 'transport' },
            { id: 'GO:0055085', label: 'transmembrane transport' },
            { id: 'GO:0015992', label: 'proton transport' },
            { id: 'GO:0006814', label: 'sodium ion transport' },
            { id: 'GO:0006813', label: 'potassium ion transport' },
            { id: 'GO:0006816', label: 'calcium ion transport' },
            { id: 'GO:0046323', label: 'glucose import' },
            { id: 'GO:0015749', label: 'monosaccharide transport' },
            { id: 'GO:0006096', label: 'glycolysis' },
            { id: 'GO:0006006', label: 'glucose metabolic process' },
            { id: 'GO:0015031', label: 'protein transport' },
            { id: 'GO:0006412', label: 'translation' }
        ]
    },

    SBO: {
        name: 'Systems Biology Ontology',
        terms: [
            { id: 'SBO:0000185', label: 'transport reaction' },
            { id: 'SBO:0000655', label: 'passive transport' },
            { id: 'SBO:0000657', label: 'active transport' },
            { id: 'SBO:0000659', label: 'facilitated diffusion' }
        ]
    },

    // Cell type ontologies
    CL: {
        name: 'Cell Ontology',
        terms: [
            { id: 'CL:0000182', label: 'hepatocyte' },
            { id: 'CL:0000746', label: 'cardiac muscle cell' },
            { id: 'CL:0000187', label: 'muscle cell' },
            { id: 'CL:0000540', label: 'neuron' },
            { id: 'CL:0000115', label: 'endothelial cell' },
            { id: 'CL:0000235', label: 'macrophage' },
            { id: 'CL:0000236', label: 'B cell' },
            { id: 'CL:0000084', label: 'T cell' }
        ]
    },

    // Fluid dynamics
    // Compartment/anatomical ontologies
    UBERON: {
        name: 'Uberon',
        terms: [
            { id: 'UBERON:0000178', label: 'blood' },
            { id: 'UBERON:0001981', label: 'blood vessel' },
            { id: 'UBERON:0001637', label: 'artery' },
            { id: 'UBERON:0001638', label: 'vein' },
            { id: 'UBERON:0000948', label: 'heart' },
            { id: 'UBERON:0002107', label: 'liver' }
        ]
    },

    FMA: {
        name: 'Foundational Model of Anatomy',
        terms: [
            { id: 'FMA:9670', label: 'blood' },
            { id: 'FMA:280556', label: 'portion of body fluid' },
            { id: 'FMA:50723', label: 'artery' },
            { id: 'FMA:50724', label: 'vein' },
            { id: 'FMA:63842', label: 'endothelium' },
            { id: 'FMA:7088', label: 'blood vessel' },
            { id: 'FMA:7197', label: 'heart' },
            { id: 'FMA:7195', label: 'liver' },
            { id: 'FMA:7203', label: 'kidney' }
        ]
    }
}