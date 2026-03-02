import { adapterRegistry } from '@/adapters'
import { eventManager } from '@/managers/event-manager'
import Hooks from '../Hooks'

function resizeBg() {
  const hooks = Hooks.getInstance()
  adapterRegistry.platform.observeElementResize('game-root', () => {
    const bgSprite = hooks.sceneManager.currentScene?.background
    if (bgSprite) {
      hooks.resizeImage({ image: bgSprite })
    }
  })
}

eventManager.install({
  name: 'resizeBg',
  event: resizeBg,
})
