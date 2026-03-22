import { useFullscreen } from '@vueuse/core'

export function useGameFullscreen() {
  const {
    isFullscreen,
    isSupported: fullscreenSupported,
    enter: fsEnter,
    exit: fsExit,
  } = useFullscreen()

  async function enter() {
    if (fullscreenSupported.value) {
      await fsEnter()
    }
  }

  async function toggle() {
    if (isFullscreen.value) {
      await fsExit()
    } else {
      await enter()
    }
  }

  return {
    isFullscreen,
    enter,
    toggle,
  }
}
