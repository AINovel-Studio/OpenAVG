import type { Sound } from '@pixi/sound'
import type { Application } from 'pixi.js'

import type { AssetsPacks } from '@/managers/assets-manager/assetsConfig'

import { AlphaFilter, Container, Sprite } from 'pixi.js'
import { fadeIn, fadeOut } from '@/filters/fade'
import { scaleToNormal } from '@/filters/zoom'
import { openAVGCore } from '@/index'
import { assetsManager } from '@/managers/assets-manager'
import { effectsManager } from '@/managers/effects-manager'
import { soundManager } from '@/managers/sound-manager'
import { tickerManager } from '@/managers/ticker-manager'
import { stageManager } from '@/stage'
import { getSaveDataList } from '@/utils/gameStorage'
import { resizeToCanvas } from '@/utils/resize'
import { createDefaultButtons, renderButtons } from './buttons'
import './events'

class MainMenu {
  app: Application
  fatherContainer: Container
  container = new Container({ label: 'MainMenu' })

  assetsManager = assetsManager
  assetsPack: AssetsPacks

  mainMenuBgSprite: Sprite
  mainMenuMusic: Sound

  private isRender = false
  btnLock = false
  btnRefresh: () => void

  constructor() { }

  init({
    app,
    fatherContainer,
    assetsPack,
  }: {
    app: Application
    fatherContainer: Container
    assetsPack: AssetsPacks
  }) {
    this.app = app
    this.fatherContainer = fatherContainer
    this.assetsPack = assetsPack
    this.fatherContainer.addChild(this.container)
    this.btnLock = false

    return this
  }

  async initFilter(mainMenuBgSprite: Sprite) {
    // 动画
    const fadeInTween = await fadeIn({
      filter: this.container.filters[0] as AlphaFilter,
    })
    const zoomOutTween = await scaleToNormal({
      sprite: mainMenuBgSprite,
      duration: 2000,
    })
    fadeInTween.start()
    zoomOutTween.start()
    if (tickerManager.hasListener('showMainMenu')) {
      tickerManager.removeListener('showMainMenu')
    }
    tickerManager.addListener('showMainMenu', () => {
      fadeInTween.update()
      zoomOutTween.update()
    })
  }

  async render() {
    if (!this.isRender) {
      const saveDataList = await getSaveDataList(openAVGCore.gameTitle)

      const mainMenuBgTexture
        = this.assetsPack.SPRITE_TEXTURE['main-menu']
      const titleTextrue = this.assetsPack.SPRITE_TEXTURE.title
      const mainMenuMusic = this.assetsPack.GAME_AUDIO['main-menu']
      const mainMenuBgSprite = new Sprite(mainMenuBgTexture)
      const title = new Sprite(titleTextrue)
      resizeToCanvas({
        image: mainMenuBgSprite,
        app: this.app,
      })
      title.position.x = (mainMenuBgSprite.width - title.width) / 2

      // 渐入效果
      const alfphaFilter = new AlphaFilter()
      alfphaFilter.alpha = 0
      this.container.filters = [alfphaFilter]

      this.container.addChild(mainMenuBgSprite)
      this.container.addChild(title)
      mainMenuMusic.loop = true
      soundManager.playBgm(mainMenuMusic)

      // 触发动画
      effectsManager.start('sakura')
      this.initFilter(mainMenuBgSprite)

      this.mainMenuBgSprite = mainMenuBgSprite
      this.mainMenuMusic = mainMenuMusic
      renderButtons(this, createDefaultButtons(saveDataList))
      this.isRender = true
    }
  }

  async stopEffects() {
    effectsManager.stopAll()
    this.container.eventMode = 'none'
  }

  async show() {
    const menuLayerManager = stageManager.layerManagers.menuLayer
    menuLayerManager.whiteBgShow()
    // 触发动画
    effectsManager.start('sakura')
    resizeToCanvas({
      image: this.mainMenuBgSprite,
      app: this.app,
    })
    await this.initFilter(this.mainMenuBgSprite)
    if (!this.mainMenuMusic.isPlaying) {
      this.mainMenuMusic.play()
    }
    this.btnRefresh && this.btnRefresh()
    this.container.eventMode = 'static'
  }

  async hide() {
    const menuLayerManager = stageManager.layerManagers.menuLayer
    menuLayerManager.whiteBgHidden()
    const mainMenuFadeOut = await fadeOut({
      filter: this.container.filters[0] as AlphaFilter,
    })
    mainMenuFadeOut.start()
    tickerManager.addListener('hideMainMenu', () => mainMenuFadeOut.update())
    effectsManager.stopAll()
    const mainMenuMusic = this.assetsPack.GAME_AUDIO['main-menu']
    mainMenuMusic.stop()
    this.container.eventMode = 'none'
  }
}

export const mainMenu = new MainMenu()
