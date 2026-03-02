import type { Sound } from '@pixi/sound'
import type { IMusic } from '@/types'

import { soundManager } from '@/managers/sound-manager'
import Hooks from '@/modules/novel/Hooks'

export function handleMusic({ assetName }: { assetName: IMusic }) {
  const hooks = Hooks.getInstance()
  let audioSprite: Sound

  if (hooks.sceneManager.currentScene.music) {
    soundManager.stopBgm()
  }

  if (typeof assetName === 'string') {
    audioSprite = hooks.assetsPack.GAME_AUDIO[assetName]
  } else {
    audioSprite = hooks.assetsPack.GAME_AUDIO[assetName.name]
    const { name, ...options } = assetName
    for (const key in options) {
      switch (key) {
        case 'pause':
          audioSprite.pause()
          hooks.sceneManager.currentScene.music = null
          hooks.sceneManager.currentScene.musicAction = null
          return
        case 'stop':
          audioSprite.stop()
          hooks.sceneManager.currentScene.music = null
          hooks.sceneManager.currentScene.musicAction = null
          return
      }
      audioSprite[key] = options[key]
    }
  }
  soundManager.playBgm(audioSprite)
  hooks.sceneManager.currentScene.music = audioSprite
  hooks.sceneManager.currentScene.musicAction = assetName
}
