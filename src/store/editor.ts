import { defineStore } from 'pinia'
import { defaultSettings } from '@/config'
import { EditorSettings } from 'types/editor/settings'

const state = {
  editorSettings: defaultSettings
}

export default defineStore('editor', {
  state: () => state,
  getters: {
    //语言
    getLocales: (state) => state.editorSettings.language,
    //获取流程定义信息
    getProcessDef: (state) => ({
      processName: state.editorSettings.processName,
      processId: state.editorSettings.processId
    }),
    //获取流程引擎信息
    getProcessEngine: (state) => state.editorSettings.processEngine,
    //编辑器配置
    getEditorConfig: (state) => ({
      bg: state.editorSettings.bg,
      paletteMode: state.editorSettings.paletteMode,
      penalMode: state.editorSettings.penalMode,
      contextPadMode: state.editorSettings.contextPadMode,
      rendererMode: state.editorSettings.rendererMode,
      toolbar: state.editorSettings.toolbar,
      miniMap: state.editorSettings.miniMap,
      contextmenu: state.editorSettings.contextmenu,
      customContextmenu: state.editorSettings.customContextmenu,
      otherModule: state.editorSettings.otherModule,
      templateChooser: state.editorSettings.templateChooser,
      useLint: state.editorSettings.useLint,
      customTheme: state.editorSettings.customTheme
    })
  },
  actions: {
    //更新配置
    updateConfiguration(conf: Partial<EditorSettings>) {
      sessionStorage.setItem('lang', <string>conf.language)
      this.$state.editorSettings = { ...this.$state.editorSettings, ...conf }
    },
    //更新语言 默认中文
    updateLanguage(lang: string) {
      sessionStorage.setItem('lang', lang)
      this.$state.editorSettings.language = lang || 'zh_CN'
    }
  }
})
