import type { Application } from 'pixi.js'
import type { IPlatformAdapter, IStorageAdapter } from './adapters'
import type { IApiCore, IGlobalConfig } from './types'
import { sound } from '@pixi/sound'

import { adapterRegistry } from './adapters'
import { LocalForageStorageAdapter } from './adapters/storage'
import { apiManager } from './managers/api-manager'
import { PixiInstance } from './pixi'
import { stageManager } from './stage'

export interface OpenAVGOptions {
  globalConfig: IGlobalConfig
  apiCore: IApiCore
  platformAdapter?: IPlatformAdapter
  storageAdapter?: IStorageAdapter
  devtools?: (app: Application) => void
}

export class OpenAVGCore {
  pixiInstance = new PixiInstance()
  stageManager = stageManager
  apiManager = apiManager
  gameTitle: string

  private _globalConfig: IGlobalConfig
  apiCore: IApiCore

  constructor() {}

  async init(options: OpenAVGOptions) {
    const {
      globalConfig,
      apiCore,
      platformAdapter,
      storageAdapter,
      devtools,
    } = options

    // 注册适配器
    if (platformAdapter) {
      adapterRegistry.platform = platformAdapter
    }
    adapterRegistry.storage = storageAdapter ?? new LocalForageStorageAdapter()

    // 注入 devtools
    if (devtools) {
      this.pixiInstance.setDevtools(devtools)
    }

    this.globalConfig = globalConfig
    this.apiCore = apiCore
    sound.disableAutoPause = true

    // 初始化 api管理器
    apiManager.init(apiCore)

    this.gameTitle = this.globalConfig.title
    await this.pixiInstance.watchInit()
    this.stageManager = await stageManager.init(
      this.pixiInstance.app,
      this.globalConfig,
    )
    return this
  }

  set globalConfig(globalConfig: IGlobalConfig) {
    this._globalConfig = globalConfig
    adapterRegistry.platform.setPageTitle(globalConfig.title)
    if (globalConfig.favicon) {
      adapterRegistry.platform.setFavicon(globalConfig.favicon)
    }
  }

  get globalConfig() {
    return this._globalConfig
  }
}

export const openAVGCore = new OpenAVGCore()

// 适配器
export { adapterRegistry } from './adapters'
export { BrowserPlatformAdapter } from './adapters/platform'
export type { IPlatformAdapter } from './adapters/platform'
export { LocalForageStorageAdapter } from './adapters/storage'
export type { IStorageAdapter } from './adapters/storage'

// 常量
export { ApiEnum, StageType } from './constants'

// 事件管理器
export { eventManager } from './managers/event-manager'

// 菜单 Actions
export { menuActions } from './modules/menu/actions'
export type { MenuHooks } from './modules/menu/actions'

// Pixi
export { PixiInstance } from './pixi'

// 舞台管理器
export { StageManager, stageManager } from './stage'
export type { MenuLayerManager } from './stage/menu-layer'
export type { NovelLayerManager } from './stage/novel-layer'

// 类型
export type * from './types'
