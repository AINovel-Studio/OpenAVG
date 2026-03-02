import type { SaveData } from '@/types'
import { StageType } from '@/constants'
import { stageManager } from '@/stage'
import { mainMenu } from '..'

export async function onContinue(saveData: SaveData) {
  if (!mainMenu.btnLock && saveData) {
    mainMenu.btnLock = true
    const sceneManager = stageManager.layerManagers.novelLayer.sceneManager
    await sceneManager.loadGame({ saveData, isMainMenu: true })
    stageManager.currentStage = StageType.NOVEL
  }
}
