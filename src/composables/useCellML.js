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
    const libcellml = ref(null)
    const importer = ref(null)
    const importIssues = ref([])
    const hasUnresolvedImports = ref(false)
    const importUrls = ref([])

    const groupedVariables = computed(() => {
        if (!libcellml.value || !variables.value.length) {
            return {}
        }

        const byComponent = {}

        variables.value.forEach(variable => {
            const componentName = variable.component.name

            if (!byComponent[componentName]) {
                byComponent[componentName] = {
                    name: componentName,
                    component: variable.component,
                    categories: {},
                    totalVariables: 0,
                    needsAnnotation: 0
                }
            }

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
                                    // addUnitByReference:ƒ(arg0)
                                    // addUnitByReferenceEnumPrefix:ƒ(arg0, arg1, arg2, arg3, arg4)
                                    // addUnitByReferenceExponent:ƒ(arg0, arg1, arg2)
                                    // addUnitByReferenceIntPrefix:ƒ(arg0, arg1, arg2, arg3, arg4)
                                    // addUnitByReferenceStringPrefix:ƒ(arg0, arg1, arg2, arg3, arg4)
                                    // addUnitByStandardUnit:ƒ(arg0)
                                    // addUnitByStandardUnitEnumPrefix:ƒ(arg0, arg1, arg2, arg3, arg4)
                                    // addUnitByStandardUnitExponent:ƒ(arg0, arg1, arg2)
                                    // addUnitByStandardUnitIntPrefix:ƒ(arg0, arg1, arg2, arg3, arg4)
                                    // addUnitByStandardUnitStringPrefix:ƒ(arg0, arg1, arg2, arg3, arg4)

                                    if (prefix) {
                                        referenceUnits.addUnitByReferenceStringPrefix(baseUnit, prefix, exponent, 1, "1")
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
                                        domain: unitConfig.domain || 'Unknown',
                                        annotationType: unitConfig.annotationType || null
                                    }

                                    if (!byComponent[componentName].categories[categoryName]) {
                                        byComponent[componentName].categories[categoryName] = []
                                    }
                                    byComponent[componentName].categories[categoryName].push(enrichedVariable)
                                    byComponent[componentName].totalVariables++

                                    if (unitConfig.annotationType) {
                                        byComponent[componentName].needsAnnotation++
                                    }

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
                    // Uncategorized
                    if (!byComponent[componentName].categories['Uncategorized']) {
                        byComponent[componentName].categories['Uncategorized'] = []
                    }
                    byComponent[componentName].categories['Uncategorized'].push({
                        ...variable,
                        domain: 'Unknown',
                        category: 'Uncategorized'
                    })
                    byComponent[componentName].totalVariables++
                }

                if (variableUnitsObject?.delete) {
                    variableUnitsObject.delete()
                    variableUnitsObject = null
                }

            } catch (error) {
                console.warn(`Error processing variable ${variable.name}:`, error)

                if (!assigned) {
                    if (!byComponent[componentName].categories['Uncategorized']) {
                        byComponent[componentName].categories['Uncategorized'] = []
                    }
                    byComponent[componentName].categories['Uncategorized'].push({
                        ...variable,
                        domain: 'Unknown',
                        category: 'Uncategorized'
                    })
                    byComponent[componentName].totalVariables++
                }

                if (variableUnitsObject?.delete) {
                    try { variableUnitsObject.delete() } catch (e) { }
                }
            }
        })

        return byComponent
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

    const getAllImportUrls = (model) => {
        const urls = new Set()

        try {
            const componentCount = model.componentCount()
            for (let i = 0; i < componentCount; i++) {
                const component = model.componentByIndex(i)

                if (component.isImport && component.isImport()) {
                    const importSource = component.importSource()
                    if (importSource && importSource.url) {
                        const url = importSource.url()
                        if (url) urls.add(url)
                    }
                }
            }

            const unitsCount = model.unitsCount()
            for (let i = 0; i < unitsCount; i++) {
                const units = model.unitsByIndex(i)

                if (units.isImport && units.isImport()) {
                    const importSource = units.importSource()
                    if (importSource && importSource.url) {
                        const url = importSource.url()
                        if (url) urls.add(url)
                    }
                }
            }

        } catch (error) {
            console.warn('Error getting import URLs:', error)
        }

        return Array.from(urls)
    }

    const addImportedFile = async (filename, content) => {
        try {
            if (!importer.value) {
                importer.value = markRaw(new libcellml.value.Importer(false))
            }

            const importedModel = parser.value.parseModel(content)

            if (!importedModel) {
                console.error(`Failed to parse imported file: ${filename}`)
                return false
            }

            const modelAdded = importer.value.addModel(importedModel, filename)

            if (!modelAdded) {
                console.error(`Failed to add import source: ${filename}`)
                return false
            }

            // Resolve and flatten model
            importer.value.resolveImports(model.value, "")
            const flattenedModel = importer.value.flattenModel(model.value)

            if (flattenedModel) {
                model.value = markRaw(flattenedModel)
                await updateModelData()
            }

            collectImportIssues(importer.value)

        } catch (error) {
            console.error('Error adding imported file:', error)
            return false
        }
    }

    const updateModelData = async () => {
        try {
            components.value = []
            variables.value = []

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
            console.error('Error updating model data:', error)
            throw error
        }
    }

    const collectImportIssues = (importer) => {
        const issues = []

        try {
            if (model.value.hasUnresolvedImports()) {
                hasUnresolvedImports.value = true

                const importCount = importer.importSourceCount()

                for (let i = 0; i < importCount; i++) {
                    const importSource = importer.importSource(i)
                    const url = importSource.url()

                    issues.push({
                        type: 'unresolved_import',
                        url: url,
                        message: `⚠️ Unresolved import: ${url}`
                    })
                }
            }

            if (importer.value) {
                const issueCount = importer.value.issueCount()
                console.log(`Importer has ${issueCount} issues`)

                for (let i = 0; i < issueCount; i++) {
                    const issue = importer.value.issue(i)
                    if (issue) {
                        const level = issue.level()
                        const description = issue.description()

                        issues.push({
                            type: 'importer_issue',
                            level: level,
                            message: `${level === 0 ? 'ℹ️' : level === 1 ? '⚠️' : '❌'} ${description}`
                        })
                    }
                }
            }

            const componentCount = model.value.componentCount()
            for (let i = 0; i < componentCount; i++) {
                const component = model.value.componentByIndex(i)

                if (component.isImport && component.isImport()) {
                    const importSource = component.importSource()
                    if (importSource) {
                        issues.push({
                            type: 'info',
                            message: `ℹ️ Component "${component.name()}" is imported from: ${importSource.url()}`
                        })
                    }
                }
            }

            const unitsCount = model.value.unitsCount()
            for (let i = 0; i < unitsCount; i++) {
                const units = model.value.unitsByIndex(i)

                if (units.isImport && units.isImport()) {
                    const importSource = units.importSource()
                    if (importSource) {
                        issues.push({
                            type: 'info',
                            message: `ℹ️ Units "${units.name()}" is imported from: ${importSource.url()}`
                        })
                    }
                }
            }

        } catch (error) {
            console.warn('Error collecting import issues:', error)
            issues.push({
                type: 'error',
                message: `Error checking imports: ${error.message}`
            })
        }

        importIssues.value = issues
        return issues
    }

    const parseModel = async (content) => {
        try {
            model.value = markRaw(parser.value.parseModel(content))
            components.value = []
            variables.value = []

            modelName.value = model.value.name()
            importUrls.value = getAllImportUrls(model.value)

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
            throw error
        }
    }

    return {
        model,
        components,
        variables,
        groupedVariables,
        parseModel,
        initLibCellML,
        importIssues,
        hasUnresolvedImports,
        importer,
        importUrls,
        addImportedFile
    }
}