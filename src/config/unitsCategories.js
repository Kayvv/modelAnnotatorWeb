export const unitsCategories = {
    "Temporal": {
        description: "Time-related properties",
        units: [
            {
                name: "ms",
                definition: [["second", "milli"]],
                domain: "Biochemistry",
                annotationType: null,
                possibleOPBTerms: ["OPB:00402"] // Temporal location, the amount of time between the origin of a temporal coordinate and a temporal instant
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
                annotationType: null,
                possibleOPBTerms: ["OPB:00293"] // Temperature
            },
            {
                name: "J",
                definition: [["joule"]],
                domain: "Biochemistry",
                annotationType: null,
                possibleOPBTerms: ["OPB:00562"] // Energy amount
            },
            {
                name: "mW",
                definition: [["watt", "milli"]],
                domain: "Biochemistry",
                annotationType: null,
                possibleOPBTerms: ["OPB:00563"] // Energy flow rate, J/s
            },
            {
                name: "S",
                definition: [["joule"], ["kelvin", null, -1]],
                domain: "Biochemistry",
                annotationType: null,
                possibleOPBTerms: ["OPB:00100"] // Thermodynamic entropy amount
            },
            {
                name: "S_per_s",
                definition: [["S"], ["second", null, -1]],
                domain: "Biochemistry",
                annotationType: null,
                possibleOPBTerms: ["OPB:00564"] // Entropy flow rate
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
                annotationType: "Quantities",
                possibleOPBTerms: ["OPB:00340"] // amount of substance
            },
            {
                name: "fmol",
                definition: [["mole", "femto"]],
                domain: "Biochemistry",
                annotationType: "Quantities",
                possibleOPBTerms: ["OPB:00425"] // Molar amount of chemical. Note, no OPB term for molar amount of particles
            },
            {
                name: "mM",
                definition: [["mole", "milli"], ["litre", null, -1]],
                domain: "Biochemistry",
                annotationType: "Quantities",
                possibleOPBTerms: ["OPB:00340", "OPB:01532"] // OPB_00340, Concentration of chemical,Volumnal concentration of solute (1). OPB_01532, Volumnal concentration of particles (2)
            },
            {
                name: "mol_per_m2",
                definition: [["mole"], ["metre", null, -2]],
                domain: "Biochemistry",
                annotationType: "Quantities",
                possibleOPBTerms: ["OPB:01529", "OPB:01530"] // OPB_01529, Areal concentration of chemical (1). OPB_01530, Areal concentration of particles (2)
            },
            {
                name: "C_per_m2",
                definition: [["coulomb"], ["metre", null, -2]],
                domain: "Biochemistry",
                annotationType: "Quantities",
                possibleOPBTerms: ["OPB:01238"] // Charge areal density
            },
            {
                name: "C_per_m3",
                definition: [["coulomb"], ["metre", null, -3]],
                domain: "Biochemistry",
                annotationType: "Quantities",
                possibleOPBTerms: ["OPB:01237"] // Charge volumetric density
            },
            {
                name: "fC",
                definition: [["coulomb", "femto"]],
                domain: "Biochemistry",
                annotationType: "Quantities",
                possibleOPBTerms: ["OPB:00411"] // Charge amount
            },
            // Fluid dynamics Quantities
            {
                name: "m3",
                definition: [["metre", null, 3]],
                domain: "Fluid dynamics",
                annotationType: "Quantities",
                possibleOPBTerms: ["OPB:00523", "OPB:00154"] // OPB_00523 when it is a constant, Spatial volume. OPB_00154 when it is a variable, Spatial amount, Fluid volume
            },
            {
                name: "um",
                definition: [["metre", "micro"]],
                domain: "Fluid dynamics",
                annotationType: null,
                possibleOPBTerms: ["OPB:01064", "OPB:00269"] // OPB_01064 when it is a constant, length. OPB_00269 when it is a variable, Translational displacement
            },
            {
                name: "m2",
                definition: [["metre", null, 2]],
                domain: "Fluid dynamics",
                annotationType: null,
                possibleOPBTerms: ["OPB:00295", "OPB:01376"] // OPB_00295 when it is a constant, area. OPB_01376 when it is a variable, Tensile distortion
            },
            {
                name: "rad",
                definition: [["radian"]],
                domain: "Fluid dynamics",
                annotationType: null,
                possibleOPBTerms: ["OPB:01072", "OPB:01601"] // OPB_01072 when it is a constant, Plane angle. OPB_01601 when it is a variable, Rotational displacement
            },
            {
                name: "kg",
                definition: [["kilogram"]],
                domain: "Fluid dynamics",
                annotationType: null,
                possibleOPBTerms: ["OPB:01226"] // Mass of solid entity
            },
            {
                name: "kg_per_m2",
                definition: [["kilogram"], ["metre", null, -2]],
                domain: "Fluid dynamics",
                annotationType: null,
                possibleOPBTerms: ["OPB:01593"] // Areal density of mass
            },
            {
                name: "kg_per_m3",
                definition: [["kilogram"], ["metre", null, -3]],
                domain: "Fluid dynamics",
                annotationType: null,
                possibleOPBTerms: ["OPB:01619"] // Volumnal density of matter
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
                annotationType: "Flow rates",
                possibleOPBTerms: ["OPB:00592", "OPB:00544"] // OPB_00592, Chemical amount flow rate. OPB_00544, Particle flow rate
            },
            {
                name: "mM_per_s",
                definition: [["mole", "milli"], ["litre", null, -1], ["second", null, -1]],
                domain: "Biochemistry",
                annotationType: "Flow rates",
                possibleOPBTerms: ["OPB:00593"] // Chemical amount density flow rate
            },
            {
                name: "mol_per_m2_s",
                definition: [["mole"], ["metre", null, -2], ["second", null, -1]],
                domain: "Biochemistry",
                annotationType: "Flow rates",
                possibleOPBTerms: ["OPB:00593"] // Chemical amount density flow rate
            },
            {
                name: "C_per_m2_s",
                definition: [["coulomb"], ["metre", null, -2], ["second", null, -1]],
                domain: "Biochemistry",
                annotationType: "Flow rates",
                possibleOPBTerms: ["OPB:00318"] // Charge flow rate No specific OPB term
            },
            {
                name: "C_per_m3_s",
                definition: [["coulomb"], ["metre", null, -3], ["second", null, -1]],
                domain: "Biochemistry",
                annotationType: "Flow rates",
                possibleOPBTerms: ["OPB:00318"] // Charge flow rate No specific OPB term
            },
            {
                name: "fA",
                definition: [["ampere", "femto"]],
                domain: "Biochemistry",
                annotationType: "Flow rates",
                possibleOPBTerms: ["OPB:00318"] // Charge flow rate, =C/s
            },
            {
                name: "m3_per_s",
                definition: [["metre", null, 3], ["second", null, -1]],
                domain: "Fluid dynamics",
                annotationType: "Flow rates",
                possibleOPBTerms: ["OPB:00299"] // Fluid flow rate
            },
            {
                name: "m_per_s",
                definition: [["metre"], ["second", null, -1]],
                domain: "Fluid dynamics",
                annotationType: null,
                possibleOPBTerms: ["OPB:00251"] // Lineal translational velocity
            },
            {
                name: "m2_per_s",
                definition: [["metre", null, 2], ["second", null, -1]],
                domain: "Fluid dynamics",
                annotationType: null,
                possibleOPBTerms: ["OPB:01643"] // Tensile distortion velocity
            },
            {
                name: "rad_per_s",
                definition: [["radian"], ["second", null, -1]],
                domain: "Fluid dynamics",
                annotationType: null,
                possibleOPBTerms: ["OPB:01490"] // Rotational solid velocity
            },
            {
                name: "kg_per_s",
                definition: [["kilogram"], ["second", null, -1]],
                domain: "Fluid dynamics",
                annotationType: null,
                possibleOPBTerms: ["OPB:01220"] // Material flow rate
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
                annotationType: "Efforts",
                possibleOPBTerms: ["OPB:00506", "OPB:01058", "OPB:01169"] // OPB_00506, Electrical potential (1), J/C. OPB_01058, Membrane potential. OPB_01169, Electrodiffusional potential
            },
            {
                name: "J_per_mol",
                definition: [["joule"], ["mole", null, -1]],
                domain: "Biochemistry",
                annotationType: "Efforts",
                possibleOPBTerms: ["OPB:00378"] // Chemical potential
            },
            {
                name: "Pa",
                definition: [["pascal"]],
                domain: "Fluid dynamics",
                annotationType: "Efforts",
                possibleOPBTerms: ["OPB:00509", "OPB:01053"] // OPB_00509,Fluid pressure, =J/m3. OPB_01053, Mechanical stress
            },
            {
                name: "N",
                definition: [["newton"]],
                domain: "Fluid dynamics",
                annotationType: null,
                possibleOPBTerms: ["OPB:00034"] // Mechanical force, =J/m
            },
            {
                name: "J_per_m2",
                definition: [["joule"], ["metre", null, -2]],
                domain: "Fluid dynamics",
                annotationType: null,
                possibleOPBTerms: ["OPB:01053"] // Mechanical stress
            },
            {
                name: "J_per_kg",
                definition: [["joule"], ["kilogram", null, -1]],
                domain: "Fluid dynamics",
                annotationType: null,
                possibleOPBTerms: ["OPB:00378"] // specific energy
            }
        ]
    }
}