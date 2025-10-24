export const ontologyCommonTerms = {
    CHEBI: {
        name: 'Chemical Entities of Biological Interest',
        terms: [
            { id: 'CHEBI:29101', label: 'Na+', category: 'Ion' },
            { id: 'CHEBI:29103', label: 'K+', category: 'Ion' },
            { id: 'CHEBI:29108', label: 'Ca2+', category: 'Ion' },
            { id: 'CHEBI:18420', label: 'Mg2+', category: 'Ion' },
            { id: 'CHEBI:15378', label: 'H+', category: 'Ion' },
            { id: 'CHEBI:17996', label: 'Cl-', category: 'Ion' },
            { id: 'CHEBI:24870', label: 'ion', category: 'Ion' },
            { id: 'CHEBI:456216', label: 'ADP(3−)', category: 'Nucleotide' },
            { id: 'CHEBI:30616', label: 'ATP(4−)', category: 'Nucleotide' },
            { id: 'CHEBI:18367', label: 'phosphate(3−)', category: 'Phosphate' },
            { id: 'CHEBI:17234', label: 'glucose', category: 'Sugar' },
            { id: 'CHEBI:17925', label: 'lactate', category: 'Metabolite' },
            { id: 'CHEBI:16236', label: 'ethanol', category: 'Alcohol' },
            { id: 'CHEBI:15377', label: 'water', category: 'Solvent' },
            { id: 'CHEBI:29985', label: 'glutamate', category: 'Amino Acid' },
            { id: 'CHEBI:16038', label: 'pyruvate', category: 'Metabolite' }
        ]
    },

    GO: {
        name: 'Gene Ontology (Cellular Component)',
        terms: [
            { id: 'GO:0005886', label: 'plasma membrane', category: 'Membrane' },
            { id: 'GO:0005829', label: 'cytosol', category: 'Cytoplasm' },
            { id: 'GO:0005739', label: 'mitochondrion', category: 'Organelle' },
            { id: 'GO:0005783', label: 'endoplasmic reticulum', category: 'Organelle' },
            { id: 'GO:0005634', label: 'nucleus', category: 'Organelle' },
            { id: 'GO:0005615', label: 'extracellular space', category: 'Extracellular' },
            { id: 'GO:0005768', label: 'endosome', category: 'Organelle' },
            { id: 'GO:0005764', label: 'lysosome', category: 'Organelle' },
            { id: 'GO:0005840', label: 'ribosome', category: 'Complex' },
            { id: 'GO:0005856', label: 'cytoskeleton', category: 'Structure' },
            { id: 'GO:0005874', label: 'microtubule', category: 'Cytoskeleton' },
            { id: 'GO:0005884', label: 'actin filament', category: 'Cytoskeleton' },
            { id: 'GO:0005882', label: 'intermediate filament', category: 'Cytoskeleton' },
            { id: 'GO:0031012', label: 'extracellular matrix', category: 'Extracellular' }
        ]
    },

    GO_BP: {
        name: 'Gene Ontology (Biological Process)',
        terms: [
            { id: 'GO:0006810', label: 'transport', category: 'Transport' },
            { id: 'GO:0055085', label: 'transmembrane transport', category: 'Transport' },
            { id: 'GO:0015992', label: 'proton transport', category: 'Ion Transport' },
            { id: 'GO:0006814', label: 'sodium ion transport', category: 'Ion Transport' },
            { id: 'GO:0006813', label: 'potassium ion transport', category: 'Ion Transport' },
            { id: 'GO:0006816', label: 'calcium ion transport', category: 'Ion Transport' },
            { id: 'GO:0046323', label: 'glucose import', category: 'Sugar Transport' },
            { id: 'GO:0015749', label: 'monosaccharide transport', category: 'Sugar Transport' },
            { id: 'GO:0006096', label: 'glycolysis', category: 'Metabolism' },
            { id: 'GO:0006006', label: 'glucose metabolic process', category: 'Metabolism' },
            { id: 'GO:0015031', label: 'protein transport', category: 'Transport' },
            { id: 'GO:0006412', label: 'translation', category: 'Protein Synthesis' }
        ]
    },

    PR: {
        name: 'Protein Ontology',
        terms: [
            { id: 'PR:000007235', label: 'GLUT2 (glucose transporter)', category: 'Transporter' },
            { id: 'PR:000001195', label: 'SGLT1 (sodium-glucose transporter)', category: 'Transporter' },
            { id: 'PR:000015665', label: 'Na+/K+ ATPase', category: 'Pump' },
            { id: 'PR:000001625', label: 'Ca2+ ATPase', category: 'Pump' },
            { id: 'PR:000001923', label: 'voltage-gated sodium channel', category: 'Channel' },
            { id: 'PR:000002066', label: 'voltage-gated potassium channel', category: 'Channel' },
            { id: 'PR:000001967', label: 'voltage-gated calcium channel', category: 'Channel' }
        ]
    },

    UNIPROT: {
        name: 'UniProt',
        terms: [
            { id: 'P14672', label: 'SLC2A2 (GLUT2)', category: 'Transporter' },
            { id: 'P13866', label: 'SLC5A1 (SGLT1)', category: 'Transporter' },
            { id: 'P05023', label: 'ATP1A1 (Na+/K+ ATPase alpha-1)', category: 'Pump' },
            { id: 'P20020', label: 'ATP2B1 (Plasma membrane Ca2+ ATPase)', category: 'Pump' }
        ]
    },

    CL: {
        name: 'Cell Ontology',
        terms: [
            { id: 'CL:0000182', label: 'hepatocyte', category: 'Epithelial' },
            { id: 'CL:0000746', label: 'cardiac muscle cell', category: 'Muscle' },
            { id: 'CL:0000187', label: 'muscle cell', category: 'Muscle' },
            { id: 'CL:0000540', label: 'neuron', category: 'Nervous' },
            { id: 'CL:0000115', label: 'endothelial cell', category: 'Epithelial' },
            { id: 'CL:0000235', label: 'macrophage', category: 'Immune' },
            { id: 'CL:0000236', label: 'B cell', category: 'Immune' },
            { id: 'CL:0000084', label: 'T cell', category: 'Immune' }
        ]
    },

    FMA: {
        name: 'Foundational Model of Anatomy',
        terms: [
            { id: 'FMA:9670', label: 'blood', category: 'Body Fluid' },
            { id: 'FMA:280556', label: 'portion of body fluid', category: 'Body Fluid' },
            { id: 'FMA:50723', label: 'artery', category: 'Blood Vessel' },
            { id: 'FMA:50724', label: 'vein', category: 'Blood Vessel' },
            { id: 'FMA:63842', label: 'endothelium', category: 'Tissue' },
            { id: 'FMA:7088', label: 'blood vessel', category: 'Blood Vessel' },
            { id: 'FMA:7197', label: 'heart', category: 'Organ' },
            { id: 'FMA:7195', label: 'liver', category: 'Organ' },
            { id: 'FMA:7203', label: 'kidney', category: 'Organ' }
        ]
    },

    UBERON: {
        name: 'Uberon',
        terms: [
            { id: 'UBERON:0000178', label: 'blood', category: 'Body Fluid' },
            { id: 'UBERON:0001981', label: 'blood vessel', category: 'Vessel' },
            { id: 'UBERON:0001637', label: 'artery', category: 'Vessel' },
            { id: 'UBERON:0001638', label: 'vein', category: 'Vessel' },
            { id: 'UBERON:0000948', label: 'heart', category: 'Organ' },
            { id: 'UBERON:0002107', label: 'liver', category: 'Organ' }
        ]
    },

    OPB: {
        name: 'Ontology of Physics for Biology',
        terms: [
            { id: 'OPB:00425', label: 'chemical concentration', category: 'Concentration' },
            { id: 'OPB:00340', label: 'amount of substance', category: 'Amount' },
            { id: 'OPB:00523', label: 'charge density', category: 'Density' },
            { id: 'OPB:00592', label: 'chemical flux', category: 'Flow' },
            { id: 'OPB:00593', label: 'fluid flow rate', category: 'Flow' },
            { id: 'OPB:01358', label: 'volumetric flow rate', category: 'Flow' },
            { id: 'OPB:00506', label: 'electrical potential difference', category: 'Potential' },
            { id: 'OPB:00378', label: 'chemical potential', category: 'Potential' },
            { id: 'OPB:00509', label: 'pressure', category: 'Pressure' },
            { id: 'OPB:01492', label: 'pressure difference', category: 'Pressure' },
            { id: 'OPB:00154', label: 'volume', category: 'Volume' }
        ]
    },

    SBO: {
        name: 'Systems Biology Ontology',
        terms: [
            { id: 'SBO:0000185', label: 'transport reaction', category: 'Process' },
            { id: 'SBO:0000655', label: 'passive transport', category: 'Process' },
            { id: 'SBO:0000657', label: 'active transport', category: 'Process' },
            { id: 'SBO:0000659', label: 'facilitated diffusion', category: 'Process' }
        ]
    }
}