<template>
  <n-popover
    :show="showPopover"
    :x="x"
    :y="y"
    :show-arrow="false"
    trigger="manual"
    placement="right-start"
  >
    <div class="bpmn-context-menu">
      <div class="context-menu_header">{{ contextMenuTitle }}</div>
      <div class="context-menu_body">
        <div v-for="item in currentReplaceOptions" :key="item.actionName" class="context-menu_item">
          <i :class="`context-menu_item_icon ${item.className}`"></i>
          <span @click="triggerAction(item, $event)">{{ translateCh(item.label) }}</span>
        </div>
      </div>
    </div>
  </n-popover>
</template>

<script lang="ts" setup>
  /**
   * @direction 自定义右键菜单
   * @author MiyueFE
   * @date 2022/7/11
   */
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import EventEmitter from '@/utils/EventEmitter'
  import { Base } from 'diagram-js/lib/model'
  import { customTranslate } from '@/additional-modules/Translate'
  import BpmnReplaceOptions from '@/utils/BpmnReplaceOptions'
  import { isAppendAction } from '@/utils/BpmnDesignerUtils'
  import contextMenuActions from '@/components/ContextMenu/contextMenuActions'

  const translateCh = customTranslate

  const showPopover = ref(false)
  const x = ref(0)
  const y = ref(0)

  const currentReplaceOptions = ref<any[]>([])

  let mouseEvent: MouseEvent | null = null
  let currentElement: Base | null = null
  //是不是追加元素
  const isAppend = ref<boolean>(false)
  //弹窗标题
  const contextMenuTitle = ref<string>('创建元素')
  //右键菜单事件
  const { appendAction, replaceAction } = contextMenuActions()

  //触发事件
  const triggerAction = (entry, event) => {
    try {
      isAppend.value
        ? appendAction(entry.target, event)
        : replaceAction(entry.target, currentElement)
      showPopover.value = false
    } catch (e) {
      console.error(e)
    }
  }

  //初始化右键点击事件回调
  const initEventCallback = (event: MouseEvent, element?: Base) => {
    x.value = event.clientX
    y.value = event.clientY
    mouseEvent = event
    currentElement = element || null
    isAppend.value = isAppendAction(element)
    currentReplaceOptions.value = BpmnReplaceOptions(element)
    contextMenuTitle.value = isAppend.value ? '创建元素' : '更改元素'
    showPopover.value = true
  }

  //关闭弹框
  const closePopover = () => (showPopover.value = false)

  //挂载是绑定点击事件
  onMounted(() => {
    EventEmitter.on('show-contextmenu', initEventCallback)
    document.body.addEventListener('click', closePopover)
  })

  //组件卸载前执行 移除相关事件
  onBeforeUnmount(() => {
    EventEmitter.removeListener('show-contextmenu', initEventCallback)
    document.body.removeEventListener('click', closePopover)
  })
</script>
