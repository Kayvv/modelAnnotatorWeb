export const unitsCategories = {
    "Temporal": {
        description: "Time-related properties",
        units: [
            {
                name: "ms",
                definition: [["second", "milli"]],
                domain: "Biochemistry",
                annotationType: null
            }
        ]
    },

    "Thermodynamic": {
        description: "Temperature and energy properties",
        units: [
            {
                name: "K",
                definition: [["kelvin"]],
                domain: "Biochemistry",
                annotationType: null
            },
            {
                name: "J",
                definition: [["joule"]],
                domain: "Biochemistry",
                annotationType: null
            },
            {
                name: "mW",
                definition: [["watt", "milli"]],
                domain: "Biochemistry",
                annotationType: null
            },
            {
                name: "S",
                definition: [["joule"], ["kelvin", null, -1]],
                domain: "Biochemistry",
                annotationType: null
            },
            {
                name: "S_per_s",
                definition: [["S"], ["second", null, -1]],
                domain: "Biochemistry",
                annotationType: null
            }
        ]
    },

    "Quantities": {
        description: "Amounts and concentrations",
        units: [
            // Biochemistry Quantities
            {
                name: "mole",
                definition: [["mole"]],
                domain: "Biochemistry",
                annotationType: "Quantities"
            },
            {
                name: "fmol",
                definition: [["mole", "femto"]],
                domain: "Biochemistry",
                annotationType: "Quantities"
            },
            {
                name: "mM",
                definition: [["mole", "milli"], ["litre", null, -1]],
                domain: "Biochemistry",
                annotationType: "Quantities"
            },
            {
                name: "mol_per_m2",
                definition: [["mole"], ["metre", null, -2]],
                domain: "Biochemistry",
                annotationType: "Quantities"
            },
            {
                name: "C_per_m2",
                definition: [["coulomb"], ["metre", null, -2]],
                domain: "Biochemistry",
                annotationType: "Quantities"
            },
            {
                name: "C_per_m3",
                definition: [["coulomb"], ["metre", null, -3]],
                domain: "Biochemistry",
                annotationType: "Quantities"
            },
            {
                name: "fC",
                definition: [["coulomb", "femto"]],
                domain: "Biochemistry",
                annotationType: "Quantities"
            },
            // Fluid dynamics Quantities
            {
                name: "m3",
                definition: [["metre", null, 3]],
                domain: "Fluid dynamics",
                annotationType: "Quantities"
            },
            // No annotation type
            {
                name: "um",
                definition: [["metre", "micro"]],
                domain: "Fluid dynamics",
                annotationType: null
            },
            {
                name: "m2",
                definition: [["metre", null, 2]],
                domain: "Fluid dynamics",
                annotationType: null
            },
            {
                name: "rad",
                definition: [["radian"]],
                domain: "Fluid dynamics",
                annotationType: null
            },
            {
                name: "kg",
                definition: [["kilogram"]],
                domain: "Fluid dynamics",
                annotationType: null
            },
            {
                name: "kg_per_m2",
                definition: [["kilogram"], ["metre", null, -2]],
                domain: "Fluid dynamics",
                annotationType: null
            },
            {
                name: "kg_per_m3",
                definition: [["kilogram"], ["metre", null, -3]],
                domain: "Fluid dynamics",
                annotationType: null
            }
        ]
    },

    "Flow rates": {
        description: "Fluxes and flows",
        units: [
            // Biochemistry Flow rates
            {
                name: "fmol_per_s",
                definition: [["mole", "femto"], ["second", null, -1]],
                domain: "Biochemistry",
                annotationType: "Flow rates"
            },
            {
                name: "mM_per_s",
                definition: [["mole", "milli"], ["litre", null, -1], ["second", null, -1]],
                domain: "Biochemistry",
                annotationType: "Flow rates"
            },
            {
                name: "mol_per_m2_s",
                definition: [["mole"], ["metre", null, -2], ["second", null, -1]],
                domain: "Biochemistry",
                annotationType: "Flow rates"
            },
            {
                name: "C_per_m2_s",
                definition: [["coulomb"], ["metre", null, -2], ["second", null, -1]],
                domain: "Biochemistry",
                annotationType: "Flow rates"
            },
            {
                name: "C_per_m3_s",
                definition: [["coulomb"], ["metre", null, -3], ["second", null, -1]],
                domain: "Biochemistry",
                annotationType: "Flow rates"
            },
            {
                name: "fA",
                definition: [["ampere", "femto"]],
                domain: "Biochemistry",
                annotationType: "Flow rates"
            },
            // Fluid dynamics Flow rates
            {
                name: "m3_per_s",
                definition: [["metre", null, 3], ["second", null, -1]],
                domain: "Fluid dynamics",
                annotationType: "Flow rates"
            },
            // No annotation type
            {
                name: "m_per_s",
                definition: [["metre"], ["second", null, -1]],
                domain: "Fluid dynamics",
                annotationType: null
            },
            {
                name: "m2_per_s",
                definition: [["metre", null, 2], ["second", null, -1]],
                domain: "Fluid dynamics",
                annotationType: null
            },
            {
                name: "rad_per_s",
                definition: [["radian"], ["second", null, -1]],
                domain: "Fluid dynamics",
                annotationType: null
            },
            {
                name: "kg_per_s",
                definition: [["kilogram"], ["second", null, -1]],
                domain: "Fluid dynamics",
                annotationType: null
            }
        ]
    },

    "Efforts": {
        description: "Potentials and driving forces",
        units: [
            // Biochemistry Efforts
            {
                name: "mV",
                definition: [["volt", "milli"]],
                domain: "Biochemistry",
                annotationType: "Efforts"
            },
            {
                name: "J_per_mol",
                definition: [["joule"], ["mole", null, -1]],
                domain: "Biochemistry",
                annotationType: "Efforts"
            },
            // Fluid dynamics Efforts
            {
                name: "Pa",
                definition: [["pascal"]],
                domain: "Fluid dynamics",
                annotationType: "Efforts"
            },
            // No annotation type
            {
                name: "N",
                definition: [["newton"]],
                domain: "Fluid dynamics",
                annotationType: null
            },
            {
                name: "J_per_m2",
                definition: [["joule"], ["metre", null, -2]],
                domain: "Fluid dynamics",
                annotationType: null
            },
            {
                name: "J_per_kg",
                definition: [["joule"], ["kilogram", null, -1]],
                domain: "Fluid dynamics",
                annotationType: null
            }
        ]
    }
}