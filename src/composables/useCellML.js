import { ref, markRaw } from 'vue'
import libcellmlModule from "libcellml.js";
import libCellMLWasm from 'libcellml.js/libcellml.wasm'
import variableGroupsConfig from '../config/variableGroups.json'

export function useCellML() {
    const model = ref(null)
    const modelName = ref(null)
    const components = ref([])
    const parser = ref(null)
    const printer = ref(null)
    const libcellml = ref(null);
    const variableGroups = ref(variableGroupsConfig)

    const initLibCellML = async () => {
        try {
            libcellml.value = await libcellmlModule(
                {
                    locateFile(path, prefix) {
                        if (path.endsWith('.wasm')) {
                            return libCellMLWasm
                        }
                        return prefix + path
                    }
                });
            if (typeof libcellml !== 'undefined') {
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
            modelName.value = markRaw(model.value.name())
            console.log("model name", modelName.value)
            const componentCount = markRaw(model.value.componentCount())

            for (let i = 0; i < componentCount; i++) {
                const component = markRaw(model.value.componentByIndex(i))
                components.value.push({
                    name: component.name() || `component ${i + 1}`,
                    variableCount: component.variableCount(),
                    component: component
                })
            }
        } catch (error) {
            console.error('Model parse failed:', error)
        }
    }

    const exportModel = () => {
        try {
            const modelString = printer.value.printModel(model.value)

            const blob = new Blob([modelString], { type: 'application/xml' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'annotated_model.cellml'
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
        parseModel,
        exportModel,
        initLibCellML
    }
}