import { sound } from '@pixi/sound'
import type { Sound } from '@pixi/sound'
import type { Application } from 'pixi.js'
import type { ISounds } from '@/types'

const UNLOCK_EVENTS = ['touchstart', 'touchend', 'click'] as const

export interface PendingPlay {
  sound: Sound
  type: 'bgm' | 'voice'
}

class SoundManager {
  app: Application
  currentTargets: ISounds = {
    bgm: [],
    voice: [],
  }

  targetsVolume = {
    bgm: 0.4,
    voice: 1,
    main: 1,
  }

  #unlocked = false
  #pendingPlays: PendingPlay[] = []

  constructor() {}

  init(app: Application) {
    this.app = app
    this.#initUnlock()
    return this
  }

  /**
   * iOS Safari 的 AudioContext 在用户交互前处于 suspended 状态
   * 注册交互事件监听，在首次用户交互时恢复 AudioContext 并播放队列中的音频
   */
  #initUnlock() {
    const audioCtx = sound.context?.audioContext
    if (!audioCtx || audioCtx.state !== 'suspended') {
      this.#unlocked = true
      return
    }

    const unlock = () => {
      if (this.#unlocked)
        return
      sound.context.audioContext.resume().then(() => {
        this.#unlocked = true
        this.#flushPending()
      })
      UNLOCK_EVENTS.forEach(e =>
        document.removeEventListener(e, unlock, { capture: true }),
      )
    }

    UNLOCK_EVENTS.forEach(e =>
      document.addEventListener(e, unlock, { capture: true }),
    )
  }

  #flushPending() {
    const plays = [...this.#pendingPlays]
    this.#pendingPlays.length = 0
    plays.forEach(({ sound: s }) => s.play())
  }

  setVolume({
    bgm,
    voice,
    main,
  }: {
    bgm: number
    voice: number
    main: number
  }) {
    this.targetsVolume.main = main
    this.targetsVolume.bgm = bgm
    this.targetsVolume.voice = voice

    this.currentTargets.bgm.forEach((bgm) => {
      bgm.volume = this.targetsVolume.bgm * this.targetsVolume.main
    })

    this.currentTargets.voice.forEach((voice) => {
      voice.volume = this.targetsVolume.voice * this.targetsVolume.main
    })
  }

  playBgm(s: Sound) {
    s.volume = this.targetsVolume.bgm * this.targetsVolume.main
    this.currentTargets.bgm.push(s)
    if (this.#unlocked) {
      s.play()
    }
    else {
      this.#pendingPlays.push({ sound: s, type: 'bgm' })
    }
  }

  playVoice(s: Sound) {
    s.volume = this.targetsVolume.voice * this.targetsVolume.main
    this.currentTargets.voice.push(s)
    if (this.#unlocked) {
      s.play()
    }
    else {
      this.#pendingPlays.push({ sound: s, type: 'voice' })
    }
  }

  stopBgm() {
    this.currentTargets.bgm.forEach((bgm) => {
      bgm.stop()
    })
    this.currentTargets.bgm.length = 0
    this.#pendingPlays = this.#pendingPlays.filter(p => p.type !== 'bgm')
  }

  stopVoice() {
    this.currentTargets.voice.forEach((voice) => {
      voice.stop()
    })
    this.currentTargets.voice.length = 0
    this.#pendingPlays = this.#pendingPlays.filter(p => p.type !== 'voice')
  }

  stopMain() {
    this.stopBgm()
    this.stopVoice()
  }
}

export const soundManager = new SoundManager()
