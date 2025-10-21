import { ref, markRaw, computed } from 'vue'
import libcellmlModule from "libcellml.js";
import libCellMLWasm from 'libcellml.js/libcellml.wasm'
import { unitsCategories } from '../config/unitsCategories.js'

export function useCellML() {
    const model = ref(null)
    const modelName = ref(null)
    const components = ref([])
    const variables = ref([])
    const parser = ref(null)
    const printer = ref(null)
    const libcellml = ref(null);

    const groupedVariables = computed(() => {
        if (!libcellml.value || !variables.value.length) {
            return { 'Uncategorized': variables.value }
        }

        const groups = {}
        Object.keys(unitsCategories).forEach(categoryName => {
            groups[categoryName] = []
        })
        groups['Uncategorized'] = []

        variables.value.forEach(variable => {
            let assigned = false
            let variableUnitName = variable.units || '???'
            let variableUnitsObject = null

            try {
                if (variable.variable?.units && typeof variable.variable.units === 'function') {
                    variableUnitsObject = variable.variable.units()
                    if (variableUnitsObject) {
                        variableUnitName = variableUnitsObject.name?.() || variableUnitName
                    }
                }

                if (variableUnitsObject) {
                    for (const [categoryName, categoryData] of Object.entries(unitsCategories)) {
                        if (assigned) break

                        for (const unitConfig of categoryData.units) {
                            if (assigned) break

                            try {
                                const referenceUnits = new libcellml.value.Units()
                                referenceUnits.setName(unitConfig.name)

                                unitConfig.definition.forEach(unitDef => {
                                    const [baseUnit, prefix = null, exponent = 1] = unitDef

                                    if (prefix && exponent !== 1) {
                                        referenceUnits.addUnitByReferenceStringPrefix(baseUnit, prefix, exponent)
                                    } else if (prefix) {
                                        referenceUnits.addUnitByReferenceStringPrefix(baseUnit, prefix)
                                    } else if (exponent !== 1) {
                                        referenceUnits.addUnitByReferenceExponent(baseUnit, exponent, "1")
                                    } else {
                                        referenceUnits.addUnitByReference(baseUnit)
                                    }
                                })

                                if (libcellml.value.Units.compatible(referenceUnits, variableUnitsObject)) {
                                    const enrichedVariable = {
                                        ...variable,
                                        category: categoryName,
                                        matchedUnit: unitConfig.name,
                                        domain: unitConfig.domain || 'Unknown'
                                    }
                                    groups[categoryName].push(enrichedVariable)
                                    assigned = true
                                }

                                if (referenceUnits?.delete) {
                                    referenceUnits.delete()
                                }

                            } catch (compareError) {
                                console.warn(`Error comparing with ${unitConfig.name}:`, compareError)
                            }
                        }
                    }
                }

                if (!assigned) {
                    groups['Uncategorized'].push({
                        ...variable,
                        domain: 'Unknown'
                    })
                }

                if (variableUnitsObject?.delete) {
                    variableUnitsObject.delete()
                    variableUnitsObject = null
                }

            } catch (error) {
                console.warn(`Error processing variable ${variable.name}:`, error)

                if (!assigned) {
                    groups['Uncategorized'].push({
                        ...variable,
                        domain: 'Unknown'
                    })
                }

                if (variableUnitsObject?.delete) {
                    try { variableUnitsObject.delete() } catch (e) { }
                }
            }
        })

        const nonEmptyGroups = {}
        Object.entries(groups).forEach(([groupName, vars]) => {
            if (vars.length > 0) {
                nonEmptyGroups[groupName] = vars
            }
        })
        return nonEmptyGroups
    })

    const initLibCellML = async () => {
        try {
            libcellml.value = await libcellmlModule({
                locateFile(path, prefix) {
                    if (path.endsWith('.wasm')) {
                        return libCellMLWasm
                    }
                    return prefix + path
                }
            });

            if (libcellml.value) {
                parser.value = markRaw(new libcellml.value.Parser(false));
                printer.value = new libcellml.value.Printer()
            }
        } catch (error) {
            console.error('libCellML load failed:', error)
        }
    }

    const parseModel = (content) => {
        try {
            model.value = markRaw(parser.value.parseModel(content))
            components.value = []
            variables.value = []

            modelName.value = model.value.name()
            console.log("model name", modelName.value)

            const componentCount = model.value.componentCount()

            for (let i = 0; i < componentCount; i++) {
                const component = markRaw(model.value.componentByIndex(i))
                const componentInfo = {
                    name: component.name() || `component ${i + 1}`,
                    variableCount: component.variableCount(),
                    component: component
                }
                components.value.push(componentInfo)

                const varCount = component.variableCount()
                for (let j = 0; j < varCount; j++) {
                    const variable = markRaw(component.variableByIndex(j))

                    // Get units
                    let unitsName = '???'
                    let unitsObject = null

                    try {
                        if (variable.units && typeof variable.units === 'function') {
                            unitsObject = variable.units()
                            if (unitsObject) {
                                unitsName = unitsObject.name?.() || '???'
                                if (unitsName === '???' || !unitsName) {
                                    unitsName = unitsObject.unitAttributeReference?.(0) || '???'
                                }
                            }
                        }
                    } catch (unitsError) {
                        console.warn(`Error getting units for variable ${j}:`, unitsError)
                    }

                    variables.value.push({
                        name: variable.name() || `Variable${j + 1}`,
                        units: unitsName,
                        initialValue: variable.initialValue() || '',
                        interfaceType: variable.interfaceType() || 'none',
                        component: componentInfo,
                        variable: variable
                    })
                }
            }
        } catch (error) {
            console.error('Model parse failed:', error)
        }
    }

    const exportModel = () => {
        try {
            if (!model.value || !printer.value) {
                throw new Error('Model or printer not initialized')
            }

            const modelString = printer.value.printModel(model.value)
            const blob = new Blob([modelString], { type: 'application/xml' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${modelName.value || 'model'}_annotated.cellml`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Export failed:', error)
        }
    }

    return {
        model,
        components,
        variables,
        groupedVariables,
        parseModel,
        exportModel,
        initLibCellML
    }
}