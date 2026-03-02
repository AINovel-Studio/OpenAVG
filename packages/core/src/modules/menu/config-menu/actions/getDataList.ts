import { openAVGCore } from '@/index'
import { getSaveDataList } from '@/utils/gameStorage'

export async function getDataList() {
  return getSaveDataList(openAVGCore.gameTitle)
}
