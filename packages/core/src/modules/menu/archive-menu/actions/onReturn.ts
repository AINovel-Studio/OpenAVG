import { StageType } from '@/constants'

import { actions } from '@/modules/menu/main-menu/actions'
import { stageManager } from '@/stage'

export async function onReturn() {
  stageManager.currentStage = stageManager.lastStage
  stageManager.lastStage = null
  if (stageManager.currentStage === StageType.GLOBAL) {
    await actions.onTitle({ reset: false })
  }
}
