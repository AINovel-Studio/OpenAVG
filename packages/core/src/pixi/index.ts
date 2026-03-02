import { soundAsset } from '@pixi/sound'
import { Application, extensions } from 'pixi.js'

export class PixiInstance {
  public app: Application
  private devtoolsInit?: (app: Application) => void

  constructor() {
    this.app = new Application()
  }

  setDevtools(init: (app: Application) => void) {
    this.devtoolsInit = init
  }

  async install(canvas: HTMLCanvasElement) {
    try {
      if (!this.isAppInitialized()) {
        await this.app.init({
          canvas,
          backgroundAlpha: 0,
          resizeTo: canvas,
          antialias: false,
        })
        extensions.add(soundAsset)
        this.devtoolsInit?.(this.app)
      }
    } catch (error) {
      console.warn(error)
    } finally {
      this.app.resize()
    }

    return this.app
  }

  async watchInit() {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (this.isAppInitialized()) {
          clearInterval(timer)
          resolve(true)
        }
      }, 100)
    })
  }

  // 判断 app 是否已经初始化并附加到 canvas
  isAppInitialized(): boolean {
    let isInit = false
    // 检查 app.view 是否已经挂载到 DOM
    try {
      const canvas = this.app && this.app?.canvas
      if (canvas && canvas.parentNode != null) {
        isInit = true
      }
    } catch (error) {
      isInit = false
      console.warn(error)
    }

    return isInit
  }
}
