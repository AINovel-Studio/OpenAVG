import { StageType } from '@/constants'
import { stageManager } from '@/stage'
import { mainMenu } from '..'

export async function onLoad(fn: () => Promise<void>) {
  mainMenu.stopEffects()
  await fn()
  stageManager.lastStage = stageManager.currentStage
  stageManager.currentStage = StageType.GLOBAL
}
