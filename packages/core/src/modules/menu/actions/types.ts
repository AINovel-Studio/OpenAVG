import type { SaveData, SaveDataList } from '@/types'

export interface MenuHooks {
  /** 主菜单需要显示时触发（返回标题、首次渲染） */
  onMenuShow: () => void | Promise<void>
  /** 主菜单需要隐藏时触发（开始游戏、继续存档） */
  onMenuHide: () => void | Promise<void>
  /** 打开存档读取界面 */
  onLoad: (saveDataList: SaveDataList, isMainMenu: boolean) => void
  /** 打开存档保存界面 */
  onSave: (saveDataList: SaveDataList) => void
  /** 打开设置界面 */
  onConfig: () => void
  /** 打开画廊 */
  onGallery: () => void
  /** 打开番外 */
  onAFStory: () => void
}

export type { SaveData, SaveDataList }
