import type { SaveDataList } from '@/types'
import { openAVGCore } from '@/index'
import { getSaveDataList } from '@/utils/gameStorage'
import { onAFStory } from './onAFStory'
import { onConfig } from './onConfig'
import { onContinue } from './onContinue'
import { onExit } from './onExit'
import { onFullScreen } from './onFullScreen'
import { onGallery } from './onGallery'
import { onLoad } from './onLoad'
import { onSave } from './onSave'
import { onStart } from './onStart'
import { onTitle } from './onTitle'

class Actions {
  private _onContinue = onContinue
  private _onExit = onExit
  private _onStart = onStart
  private _onLoad = onLoad
  private _onGallery = onGallery
  private _onAFStory = onAFStory
  private _onConfig = onConfig
  private _onSave = onSave
  private _onTitle = onTitle
  private _onFullScreen = onFullScreen

  private onLoadInner: (isMainMenu: boolean) => Promise<void>
  private onConfigInner: (isMainMenu: boolean) => Promise<void>
  private onSaveInner: () => Promise<void>

  constructor() { }

  async installOnLoad(fn: (saveDataList: SaveDataList, isMainMenu: boolean) => void) {
    this.onLoadInner = async (isMainMenu: boolean) => {
      const saveDataList = await getSaveDataList(openAVGCore.gameTitle)
      fn(saveDataList, isMainMenu)
    }
  }

  async installOnSave(fn: (saveDataList: SaveDataList) => void) {
    this.onSaveInner = async () => {
      const saveDataList = await getSaveDataList(openAVGCore.gameTitle)
      fn(saveDataList)
    }
  }

  async installOnConfig(fn: (saveDataList: SaveDataList) => void) {
    this.onConfigInner = async () => {
      const saveDataList = await getSaveDataList(openAVGCore.gameTitle)
      fn(saveDataList)
    }
  }

  get onTitle() {
    return this._onTitle
  }

  get onFullScreen() {
    return this._onFullScreen
  }

  get onSave() {
    const fn = async () => {
      this._onSave(this.onSaveInner)
    }
    return fn
  }

  get onContinue() {
    return this._onContinue
  }

  get onExit() {
    return this._onExit
  }

  get onStart() {
    return this._onStart
  }

  get onLoad() {
    const fn = (isMainMenu: boolean = false) => {
      this._onLoad(() => this.onLoadInner(isMainMenu))
    }
    return fn
  }

  get onGallery() {
    return this._onGallery
  }

  get onAFStory() {
    return this._onAFStory
  }

  get onConfig() {
    const fn = (isMainMenu: boolean = false) => {
      this._onConfig(() => this.onConfigInner(isMainMenu))
    }
    return fn
  }
}

export const actions = new Actions()
