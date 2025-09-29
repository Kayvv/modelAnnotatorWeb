// config/unitsCategories.js
export const unitsCategories = {
    "Temporal": {
        description: "Time-related properties",
        units: [
            {
                name: "ms",
                definition: [["second", "milli"]]
            }
        ]
    },

    "Thermodynamic": {
        description: "Temperature and energy properties",
        units: [
            {
                name: "K",
                definition: [["kelvin"]]
            },
            {
                name: "J",
                definition: [["joule"]]
            },
            {
                name: "mW",
                definition: [["watt", "milli"]]
            },
            {
                name: "S",
                definition: [["joule"], ["kelvin", null, -1]]
            },
            {
                name: "S_per_s",
                definition: [["S"], ["second", null, -1]]
            }
        ]
    },

    "Quantities": {
        description: "Length, area, volume, and angle properties",
        units: [
            {
                name: "um",
                definition: [["metre", "micro"]]
            },
            {
                name: "m2",
                definition: [["metre", null, 2]]
            },
            {
                name: "m3",
                definition: [["metre", null, 3]]
            },
            {
                name: "rad",
                definition: [["radian"]]
            },
            {
                name: "kg",
                definition: [["kilogram"]]
            },
            {
                name: "fmol",
                definition: [["mole", "femto"]]
            },
            {
                name: "kg_per_m2",
                definition: [["kilogram"], ["metre", null, -2]]
            },
            {
                name: "kg_per_m3",
                definition: [["kilogram"], ["metre", null, -3]]
            },
            {
                name: "mM",
                definition: [["mole", "milli"], ["litre", null, -1]]
            },
            {
                name: "mol_per_m2",
                definition: [["mole"], ["metre", null, -2]]
            },
            {
                name: "C_per_m2",
                definition: [["coulomb"], ["metre", null, -2]]
            },
            {
                name: "C_per_m3",
                definition: [["coulomb"], ["metre", null, -3]]
            }
        ]
    },

    "Electrical": {
        description: "Electrical properties",
        units: [
            {
                name: "fC",
                definition: [["coulomb", "femto"]]
            }
        ]
    },

    "Flow rates": {
        description: "Rate and velocity properties",
        units: [
            {
                name: "m_per_s",
                definition: [["metre"], ["second", null, -1]]
            },
            {
                name: "m2_per_s",
                definition: [["metre", null, 2], ["second", null, -1]]
            },
            {
                name: "m3_per_s",
                definition: [["metre", null, 3], ["second", null, -1]]
            },
            {
                name: "rad_per_s",
                definition: [["radian"], ["second", null, -1]]
            },
            {
                name: "kg_per_s",
                definition: [["kilogram"], ["second", null, -1]]
            },
            {
                name: "fmol_per_s",
                definition: [["mole", "femto"], ["second", null, -1]]
            },
            {
                name: "fA",
                definition: [["ampere", "femto"]]
            }
        ]
    },

    "Efforts": {
        description: "Density flow rate properties",
        units: [
            {
                name: "N",
                definition: [["newton"]]
            },
            {
                name: "J_per_m2",
                definition: [["joule"], ["metre", null, -2]]
            },
            {
                name: "Pa",
                definition: [["pascal"]]
            },
            {
                name: "J_per_mol",
                definition: [["joule"], ["mole", null, -1]]
            },
            {
                name: "mV",
                definition: [["volt", "milli"]]
            },
            {
                name: "mM_per_s",
                definition: [["mole", "milli"], ["litre", null, -1], ["second", null, -1]]
            },
            {
                name: "mol_per_m2_s",
                definition: [["mole"], ["metre", null, -2], ["second", null, -1]]
            },
            {
                name: "C_per_m2_s",
                definition: [["coulomb"], ["metre", null, -2], ["second", null, -1]]
            },
            {
                name: "C_per_m3_s",
                definition: [["coulomb"], ["metre", null, -3], ["second", null, -1]]
            }
        ]
    }
}