export const unitsCategories = {

    "Thermodynamic properties": {
        description: "Temperature and energy properties",
        units: [
            {
                name: "K",
                definition: [["kelvin"]],
                domain: "Biochemistry"
            },
            {
                name: "J",
                definition: [["joule"]],
                domain: "Biochemistry"
            },
            {
                name: "mW",
                definition: [["watt", "milli"]],
                domain: "Biochemistry"
            },
            {
                name: "S",
                definition: [["joule"], ["kelvin", null, -1]],
                domain: "Biochemistry"
            },
            {
                name: "S_per_s",
                definition: [["S"], ["second", null, -1]],
                domain: "Biochemistry"
            }
        ]
    },

    "Quantities": {
        description: "Length, area, volume, and angle properties",
        units: [
            {
                name: "um",
                definition: [["metre", "micro"]],
                domain: "Fluid dynamics"
            },
            {
                name: "m2",
                definition: [["metre", null, 2]],
                domain: "Fluid dynamics"
            },
            {
                name: "m3",
                definition: [["metre", null, 3]],
                domain: "Fluid dynamics"
            },
            {
                name: "rad",
                definition: [["radian"]],
                domain: "Fluid dynamics"
            },
            {
                name: "kg",
                definition: [["kilogram"]],
                domain: "Fluid dynamics"
            },
            {
                name: "fmol",
                definition: [["mole", "femto"]],
                domain: "Biochemistry"
            },
            {
                name: "kg_per_m2",
                definition: [["kilogram"], ["metre", null, -2]],
                domain: "Fluid dynamics"
            },
            {
                name: "kg_per_m3",
                definition: [["kilogram"], ["metre", null, -3]],
                domain: "Fluid dynamics"
            },
            {
                name: "mM",
                definition: [["mole", "milli"], ["litre", null, -1]],
                domain: "Biochemistry"
            },
            {
                name: "mol_per_m2",
                definition: [["mole"], ["metre", null, -2]],
                domain: "Biochemistry"
            },
            {
                name: "C_per_m2",
                definition: [["coulomb"], ["metre", null, -2]],
                domain: "Biochemistry"
            },
            {
                name: "C_per_m3",
                definition: [["coulomb"], ["metre", null, -3]],
                domain: "Biochemistry"
            },
            {
                name: "fC",
                definition: [["coulomb", "femto"]],
                domain: "Biochemistry"
            }
        ]
    },

    "Flow rates": {
        description: "Rate and velocity properties",
        units: [
            {
                name: "m_per_s",
                definition: [["metre"], ["second", null, -1]],
                domain: "Fluid dynamics"
            },
            {
                name: "m2_per_s",
                definition: [["metre", null, 2], ["second", null, -1]],
                domain: "Fluid dynamics"
            },
            {
                name: "m3_per_s",
                definition: [["metre", null, 3], ["second", null, -1]],
                domain: "Fluid dynamics"
            },
            {
                name: "rad_per_s",
                definition: [["radian"], ["second", null, -1]],
                domain: "Fluid dynamics"
            },
            {
                name: "kg_per_s",
                definition: [["kilogram"], ["second", null, -1]],
                domain: "Fluid dynamics"
            },
            {
                name: "fmol_per_s",
                definition: [["mole", "femto"], ["second", null, -1]],
                domain: "Biochemistry"
            },
            {
                name: "fA",
                definition: [["ampere", "femto"]],
                domain: "Biochemistry"
            },
            {
                name: "mM_per_s",
                definition: [["mole", "milli"], ["litre", null, -1], ["second", null, -1]],
                domain: "Biochemistry"
            },
            {
                name: "mol_per_m2_s",
                definition: [["mole"], ["metre", null, -2], ["second", null, -1]],
                domain: "Biochemistry"
            },
            {
                name: "C_per_m2_s",
                definition: [["coulomb"], ["metre", null, -2], ["second", null, -1]],
                domain: "Biochemistry"
            },
            {
                name: "C_per_m3_s",
                definition: [["coulomb"], ["metre", null, -3], ["second", null, -1]],
                domain: "Biochemistry"
            }
        ]
    },

    "Efforts": {
        description: "Density flow rate properties",
        units: [
            {
                name: "N",
                definition: [["newton"]],
                domain: "Fluid dynamics"
            },
            {
                name: "J_per_m2",
                definition: [["joule"], ["metre", null, -2]],
                domain: "Fluid dynamics"
            },
            {
                name: "Pa",
                definition: [["pascal"]],
                domain: "Fluid dynamics"
            },
            {
                name: "J_per_mol",
                definition: [["joule"], ["mole", null, -1]],
                domain: "Biochemistry"
            },
            {
                name: "mV",
                definition: [["volt", "milli"]],
                domain: "Biochemistry"
            },
            {
                name: "J_per_kg",
                definition: [["joule"], ["kilogram", null, -1]],
                domain: "Fluid dynamics"
            }
        ]
    }
}