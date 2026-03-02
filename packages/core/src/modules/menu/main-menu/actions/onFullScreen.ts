import { adapterRegistry } from '@/adapters'

export function onFullScreen() {
  adapterRegistry.platform.requestFullscreen()
}
