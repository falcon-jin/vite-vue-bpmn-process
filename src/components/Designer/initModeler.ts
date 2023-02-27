import { markRaw, Ref } from 'vue'
import { ViewerOptions } from 'diagram-js/lib/model'
import Modeler from 'bpmn-js/lib/Modeler'
import EventEmitter from '@/utils/EventEmitter'
import modelerStore from '@/store/modeler'
import { Moddle } from 'moddle'
import Modeling from 'bpmn-js/lib/features/modeling/Modeling'
import Canvas from 'diagram-js/lib/core/Canvas'
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
import EnhancementContextmenu from '@/additional-functions/EnhancementContextmenu'

/**
 * 初始化模型
 * @param designer 设计器
 * @param modelerModules 模块以及模块声明
 * @param emit 触发事件
 */
export default function (
  designer: Ref<HTMLElement | null>,
  modelerModules: ViewerOptions<Element>,
  emit
) {
  //模型缓存对象
  const store = modelerStore()

  //模型配置项
  const options: ViewerOptions<Element> = {
    container: designer!.value as HTMLElement,
    additionalModules: modelerModules[0] || [],
    moddleExtensions: modelerModules[1] || {},
    ...modelerModules[2]
  }
  // 清除旧 modeler
  store.getModeler && store.getModeler.destroy()
  store.setModeler(null)

  const modeler: Modeler = new Modeler(options)
  //设置新 modeler
  store.setModeler(markRaw(modeler))
  store.setModules('moddle', markRaw(modeler.get<Moddle>('moddle')))
  store.setModules('modeling', markRaw(modeler.get<Modeling>('modeling')))
  store.setModules('canvas', markRaw(modeler.get<Canvas>('canvas')))
  store.setModules('elementRegistry', markRaw(modeler.get<ElementRegistry>('elementRegistry')))

  EventEmitter.emit('modeler-init', modeler)

  //给模型添加右键扩展
  EnhancementContextmenu(modeler)
  //监听流程图变更事件
  modeler.on('commandStack.changed', async (event) => {
    try {
      //保存并格式化流程图
      const { xml } = await modeler.saveXML({ format: true })

      emit('update:xml', xml)
      emit('command-stack-changed', event)
    } catch (error) {
      console.error(error)
    }
  })
}
