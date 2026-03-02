import type { MenuHooks } from './types'
import type { SaveData, SaveDataList } from '@/types'

import { adapterRegistry } from '@/adapters'
import { ApiEnum, StageType } from '@/constants'
import { openAVGCore } from '@/index'
import { apiManager } from '@/managers/api-manager'
import { tickerManager } from '@/managers/ticker-manager'
import { stageManager } from '@/stage'
import { getSaveDataList } from '@/utils/gameStorage'

class MenuActions {
  private hooks: Partial<MenuHooks> = {}

  install(hooks: Partial<MenuHooks>) {
    Object.assign(this.hooks, hooks)
  }

  /** 隐藏菜单层的 Pixi 白色背景 */
  private hideMenuLayer() {
    stageManager.layerManagers.menuLayer.whiteBgHidden()
  }

  /** 显示菜单层的 Pixi 白色背景 */
  private showMenuLayer() {
    stageManager.layerManagers.menuLayer.whiteBgShow()
  }

  /** 开始新游戏 → 触发 onMenuHide → 加载 chapter1 → 切到 NOVEL */
  async onStart() {
    tickerManager.clearListeners()
    this.hideMenuLayer()
    const [chapter] = await Promise.all([
      apiManager.fetch({
        name: ApiEnum.fetchChapter,
        params: { name: 'chapter1' },
      }),
      this.hooks.onMenuHide?.(),
    ])
    stageManager.currentStage = StageType.NOVEL
    const sceneManager = stageManager.layerManagers.novelLayer.sceneManager
    await sceneManager.initChapter({ chapter })
  }

  /** 继续存档 → 触发 onMenuHide → 加载存档 → 切到 NOVEL */
  async onContinue(saveData: SaveData) {
    if (!saveData)
      return
    this.hideMenuLayer()
    await this.hooks.onMenuHide?.()
    const sceneManager = stageManager.layerManagers.novelLayer.sceneManager
    await sceneManager.loadGame({ saveData, isMainMenu: true })
    stageManager.currentStage = StageType.NOVEL
  }

  /** 打开读取菜单 → 获取存档 → 切到 GLOBAL → 触发 onLoad hook */
  async onLoad(isMainMenu: boolean = false) {
    const saveDataList = await getSaveDataList(openAVGCore.gameTitle)
    stageManager.lastStage = stageManager.currentStage
    stageManager.currentStage = StageType.GLOBAL
    this.hooks.onLoad?.(saveDataList, isMainMenu)
  }

  /** 打开保存菜单 → 获取存档 → 切到 GLOBAL → 触发 onSave hook */
  async onSave() {
    const saveDataList = await getSaveDataList(openAVGCore.gameTitle)
    stageManager.lastStage = stageManager.currentStage
    stageManager.currentStage = StageType.GLOBAL
    this.hooks.onSave?.(saveDataList)
  }

  /** 打开设置 → 切到 GLOBAL → 触发 onConfig hook */
  onConfig() {
    stageManager.lastStage = stageManager.currentStage
    stageManager.currentStage = StageType.GLOBAL
    this.hooks.onConfig?.()
  }

  /** 返回标题画面 → 重置 novelLayer → 切到 GLOBAL → 触发 onMenuShow */
  async onTitle({ reset = true }: { reset?: boolean } = {}) {
    if (reset) {
      stageManager.layerManagers.novelLayer.reset()
    }
    this.showMenuLayer()
    stageManager.currentStage = StageType.GLOBAL
    await this.hooks.onMenuShow?.()
  }

  /** 全屏切换 */
  onFullScreen() {
    adapterRegistry.platform.requestFullscreen()
  }

  /** 退出游戏 */
  onExit() {
    stageManager.currentStage = StageType.GLOBAL
    adapterRegistry.platform.navigateTo('about:blank')
  }

  /** 打开画廊 → 切到 GLOBAL → 触发 onGallery hook */
  onGallery() {
    stageManager.currentStage = StageType.GLOBAL
    this.hooks.onGallery?.()
  }

  /** 打开番外 → 切到 GLOBAL → 触发 onAFStory hook */
  onAFStory() {
    stageManager.currentStage = StageType.GLOBAL
    this.hooks.onAFStory?.()
  }

  // === 工具方法 ===

  /** 获取存档列表 */
  async getSaveDataList(): Promise<SaveDataList> {
    return getSaveDataList(openAVGCore.gameTitle)
  }

  /** 返回上一个舞台（二级菜单关闭时用） */
  async returnToPreviousStage() {
    stageManager.currentStage = stageManager.lastStage
    stageManager.lastStage = null
    if (stageManager.currentStage === StageType.GLOBAL) {
      this.showMenuLayer()
      await this.hooks.onMenuShow?.()
    }
  }
}

export const menuActions = new MenuActions()

export type { MenuHooks } from './types'
