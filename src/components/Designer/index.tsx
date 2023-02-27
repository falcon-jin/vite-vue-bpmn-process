import { defineComponent, ref, toRefs, nextTick, watch } from 'vue'
import type { PropType } from 'vue'
import { storeToRefs } from 'pinia'

import editor from '@/store/editor'
import modulesAndModdle from '@/components/Designer/modulesAndModdle'
import initModeler from '@/components/Designer/initModeler'
import { createNewDiagram } from '@/utils'

/**
 * 流程设计器
 */
const Designer = defineComponent({
  name: 'Designer',
  props: {
    xml: {
      type: String as PropType<string>,
      default: undefined
    }
  },
  emits: ['update:xml', 'command-stack-changed'],
  setup(props, { emit }) {
    //编辑器存储
    const editorStore = editor()
    //配置设置响应式对象
    const { editorSettings } = storeToRefs(editorStore)
    //将xml转成响应式对象
    const { xml } = toRefs(props)
    //设计器
    const designer = ref<HTMLDivElement | null>(null)

    watch(
      () => editorSettings.value,
      async (value, oldValue) => {
        try {
          //模块以及模块声明对象
          const modelerModules = modulesAndModdle(editorSettings)
          await nextTick()
          //初始化模型
          initModeler(designer, modelerModules, emit)
          if (!oldValue || value.processEngine !== oldValue!.processEngine) {
            //之前没有初始化过流程引擎 或者新的流程引擎和旧的不一样 创建空流程引擎
            await createNewDiagram()
          } else {
            //创建新的流程引擎
            await createNewDiagram(xml.value, editorSettings.value)
          }
        } catch (e) {
          console.log(e)
        }
      },
      { deep: true, immediate: true }
    )

    return () => <div ref={designer} class="designer"></div>
  }
})

export default Designer
