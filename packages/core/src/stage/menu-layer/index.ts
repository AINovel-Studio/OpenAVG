import type { Application } from 'pixi.js'
import { Container, Graphics } from 'pixi.js'

export class MenuLayerManager {
  app: Application
  container = new Container({ label: 'MenuLayer' })

  private isRender = false
  private whiteBg: Graphics

  constructor(app: Application) {
    this.app = app

    this.whiteBg = new Graphics()
      .roundRect(0, 0, this.app.screen.width, this.app.screen.height)
      .fill({ color: 'white' })
    this.container.addChild(this.whiteBg)
  }

  whiteBgHidden() {
    this.whiteBg.visible = false
  }

  whiteBgShow() {
    this.whiteBg.visible = true
  }

  async render() {
    if (!this.isRender) {
      this.isRender = true
    }
  }
}
