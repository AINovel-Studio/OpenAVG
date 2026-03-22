import type { Application } from 'pixi.js'
import type { IActions, IChapter, IScene, ISceneContainers, ISceneRaw, SaveData } from '@/types'
import { sound } from '@pixi/sound'

import { Container } from 'pixi.js'

import { execActions } from '@/modules/novel/actions'
import { DialogueBox } from '@/modules/novel/components/dialogueBox'
import { loadGame as _loadGame, saveGame as _saveGame } from './saveLoad'
import '@/modules/novel/events'

export class SceneManager {
  app: Application
  container = new Container({ label: 'Scene' })
  sceneContainers: ISceneContainers = {
    background: new Container({ label: 'Background' }),
    images: new Container({ label: 'Images' }),
    dialogueBox: new Container({ label: 'DialogueBox' }),
    ui: new Container({ label: 'UI' }),
  }

  chapter: IChapter
  isLastAction = false
  isExecuting = false
  currentScene: IScene = {
    sceneName: null,
    currentActionsId: 0,
    currentSceneId: 0,
    actionsList: [],
  }

  currentSceneId: number
  sceneStack: IScene[] = []
  dialogueBox: DialogueBox

  constructor(app: Application) {
    this.app = app
    this.currentSceneId = 0
    this.container.eventMode = 'static'

    for (const key in this.sceneContainers) {
      this.container.addChild(this.sceneContainers[key])
    }
    this.dialogueBox = new DialogueBox({
      app: this.app,
    })
    this.sceneContainers.dialogueBox.addChild(this.dialogueBox.container)
  }

  reset() {
    sound.stopAll()
    this.container.eventMode = 'static'
    this.currentScene = {
      sceneName: null,
      currentActionsId: 0,
      currentSceneId: 0,
      actionsList: [],
    }
    this.currentSceneId = 0
    this.sceneStack = []
    this.isLastAction = false
    this.isExecuting = false
    this.chapter = null

    for (const key in this.sceneContainers) {
      (this.sceneContainers[key] as Container).removeChildren()
    }
    this.dialogueBox = new DialogueBox({
      app: this.app,
    })

    this.sceneContainers.dialogueBox.addChild(this.dialogueBox.container)
  }

  async initChapter({
    chapter,
    isLoad = false,
    actionsImp,
  }: {
    chapter: IChapter
    isLoad?: boolean
    actionsImp?: IActions
  }) {
    this.chapter = chapter
    const scenes = chapter.scenes

    if (scenes) {
      // 渲染对话框
      this.dialogueBox.render()
      if (!isLoad) {
        await this.changeScene(scenes[0])
      } else {
        await this.nextActions({ actionsImp })
      }
    }
  }

  async nextActions({
    actionsImp,
  }: {
    actionsImp?: IActions
  } = {}) {
    try {
      const currentScene = this.currentScene
      let actions: IActions
      if (!actionsImp) {
        actions = currentScene.actionsList[currentScene.currentActionsId]
      } else {
        actions = actionsImp
      }

      if (
        !currentScene.actionsList.length
        || currentScene.currentActionsId
        === currentScene.actionsList.length - 1
      ) {
        this.isLastAction = true
      }
      // 处理actions指令
      if (!this.isExecuting) {
        this.isExecuting = true
        await execActions({ actions })
        currentScene.currentActionsId++
        this.isExecuting = false
      }
    } catch (err) {
      console.error(err)
    }
  }

  nextScene() {
    const scenes = this.chapter?.scenes
    if (scenes) {
      if (this.currentSceneId < scenes.length - 1) {
        this.currentSceneId++
        this.isLastAction = false
        this.changeScene(scenes[this.currentSceneId])
      } else {
        console.log('end')
      }
    }
  }

  async changeScene(sceneRaw: ISceneRaw) {
    if (this.currentScene) {
      this.sceneStack.push(this.currentScene)
    }

    // 暂存上一个scene的 对话图片音频 等状态 （ 恢复存档用 ）
    const background = this.currentScene && this.currentScene.background
    const music = this.currentScene && this.currentScene.music
    const images = this.currentScene && this.currentScene.images
    const talk = this.currentScene && this.currentScene.talk

    const backgroundAction = this.currentScene && this.currentScene.backgroundAction
    const musicAction = this.currentScene && this.currentScene.musicAction
    const imagesAction = this.currentScene && this.currentScene.imagesAction

    const scene: IScene = {
      sceneName: sceneRaw.name,
      currentActionsId: 0,
      currentSceneId: this.currentSceneId,
      actionsList: sceneRaw.actions,
      background,
      music,
      images,
      talk,
      backgroundAction,
      musicAction,
      imagesAction,
    }

    this.currentScene = scene
    await this.nextActions()
  }

  async saveGame(id: number) {
    return _saveGame(this, id)
  }

  async loadGame(options: {
    saveData?: SaveData
    i?: number
    isMainMenu?: boolean
  }) {
    return _loadGame(this, options)
  }
}
