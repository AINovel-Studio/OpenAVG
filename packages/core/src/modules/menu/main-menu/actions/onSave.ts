import { StageType } from '@/constants'
import { stageManager } from '@/stage'
import { mainMenu } from '..'

export async function onSave(fn: () => Promise<void>) {
  mainMenu.stopEffects()
  await fn()
  stageManager.lastStage = stageManager.currentStage
  stageManager.currentStage = StageType.GLOBAL
}
