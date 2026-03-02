import { adapterRegistry } from '@/adapters'
import { StageType } from '@/constants'
import { stageManager } from '@/stage'

export function onExit() {
  stageManager.currentStage = StageType.GLOBAL
  adapterRegistry.platform.navigateTo('about:blank')
}
