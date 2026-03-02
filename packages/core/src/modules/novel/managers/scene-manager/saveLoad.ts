import type { IActions, SaveData } from '@/types'

import dayjs from 'dayjs'
import { RenderTexture } from 'pixi.js'

import { adapterRegistry } from '@/adapters'
import { ApiEnum, openAVGCore, stageManager, StageType } from '@/index'
import { apiManager } from '@/managers/api-manager'
import { tickerManager } from '@/managers/ticker-manager'
import { getSaveDataList, setSaveDataList } from '@/utils/gameStorage'

export async function saveGame(sceneManager: any, id: number) {
  const renderTexture = RenderTexture.create({
    width: sceneManager.app.canvas.width,
    height: sceneManager.app.canvas.height,
  })
  sceneManager.dialogueBox.hide()
  sceneManager.app.renderer.render(sceneManager.app.stage, { renderTexture })
  const imgRaw = await sceneManager.app.renderer.extract.image(renderTexture)

  const img = await adapterRegistry.platform.createThumbnail(imgRaw, 288, 162)

  const title = sceneManager.chapter && sceneManager.chapter.title
  const sceneName = sceneManager.currentScene && sceneManager.currentScene.sceneName
  const filename = sceneManager.chapter && sceneManager.chapter.filename
  const time = dayjs().valueOf()
  const currentActionsId = sceneManager.currentScene && sceneManager.currentScene.currentActionsId - 1
  const currentSceneId = sceneManager.currentSceneId

  const backgroundAction = sceneManager.currentScene && sceneManager.currentScene.backgroundAction
  const musicAction = sceneManager.currentScene && sceneManager.currentScene.musicAction
  const imagesAction = sceneManager.currentScene && sceneManager.currentScene.imagesAction
  const currentSprites = {
    backgroundAction,
    musicAction,
    imagesAction,
  }

  const data: SaveData = {
    title,
    filename,
    sceneName,
    img,
    time,
    currentActionsId,
    currentSceneId,
    currentSprites,
  }
  sceneManager.dialogueBox.show()

  const saveDataList = await getSaveDataList(openAVGCore.gameTitle) || {}

  // 0 为最新存档
  if (!saveDataList[0] || saveDataList[0].time <= data.time) {
    saveDataList[0] = data
  }

  const saveData = {
    ...saveDataList,
    [id]: data,
  }

  await setSaveDataList(openAVGCore.gameTitle, saveData)
}

export async function loadGame(sceneManager: any, {
  saveData,
  i,
  isMainMenu = false,
}: {
  saveData?: SaveData
  i?: number
  isMainMenu?: boolean
}) {
  if (isMainMenu) {
    tickerManager.clearListeners()
    const mainMenu = stageManager.layerManagers.menuLayer.menus.mainMenu
    stageManager.currentStage = StageType.NOVEL
    await mainMenu.hide()
  }

  let data: SaveData
  if (saveData) {
    data = saveData
  } else {
    const dataList = await getSaveDataList(openAVGCore.gameTitle)
    data = dataList[i]
  }

  sceneManager.reset()

  const filename = data.filename
  sceneManager.chapter = await apiManager.fetch({
    name: ApiEnum.fetchChapter,
    params: { name: filename },
  })

  sceneManager.currentSceneId = data.currentSceneId
  sceneManager.currentScene.sceneName = data.sceneName
  sceneManager.currentScene.currentActionsId = data.currentActionsId
  sceneManager.currentScene.currentSceneId = data.currentSceneId
  sceneManager.currentScene.actionsList = sceneManager.chapter.scenes[sceneManager.currentSceneId].actions

  const actionsImp: IActions = {
    background: data.currentSprites.backgroundAction,
    music: data.currentSprites.musicAction,
    images: data.currentSprites.imagesAction,
    ...sceneManager.chapter.scenes[sceneManager.currentSceneId].actions[sceneManager.currentScene.currentActionsId],
  }

  await sceneManager.initChapter({ chapter: sceneManager.chapter, isLoad: true, actionsImp })
}
