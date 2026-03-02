import type { SaveDataList } from '../types'
import { adapterRegistry } from '../adapters'

export async function getSaveDataList(gameTitle: string): Promise<SaveDataList | null> {
  return adapterRegistry.storage.getItem<SaveDataList>(`${gameTitle}-saveGame`)
}

export async function setSaveDataList(
  gameTitle: string,
  data: SaveDataList,
): Promise<void> {
  await adapterRegistry.storage.setItem(`${gameTitle}-saveGame`, data)
}
