import { adapterRegistry } from '@/adapters'
import { eventManager } from '@/managers/event-manager'
import { resizeToCanvas } from '@/utils/resize'
import { mainMenu } from '../'

function resizeMainMenu() {
  adapterRegistry.platform.observeElementResize('game-root', () => {
    resizeToCanvas({
      image: mainMenu.mainMenuBgSprite,
      app: mainMenu.app,
    })
  })
}

eventManager.install({
  name: 'resizeMainMenu',
  event: resizeMainMenu,
})
