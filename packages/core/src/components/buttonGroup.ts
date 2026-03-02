import type { CommonButton } from './button'

export class ButtonGroup {
  buttons: CommonButton[] = [] // 存储按钮
  private selectedButton: CommonButton | null = null // 当前选中的按钮

  constructor(buttons: CommonButton[]) {
    this.buttons = buttons
    this.initializeButtons() // 初始化按钮组
  }

  // 初始化按钮，设置按钮点击后的回调
  private initializeButtons() {
    this.buttons.forEach((button) => {
      button.onClickAfter = () => this.handleButtonClick(button) // 设置点击后的回调
    })
  }

  // 处理按钮点击事件
  private handleButtonClick(clickBtn) {
    this.buttons.forEach((button) => {
      if (button !== clickBtn) {
        this.deselectButton(button)
      } else {
        this.selectButton(button)
      }
    })
  }

  // 选中按钮
  private selectButton(button: CommonButton) {
    button.checked = true // 设置按钮为选中状态
    this.selectedButton = button // 更新当前选中的按钮
  }

  // 取消选中按钮
  private deselectButton(button: CommonButton) {
    this.selectedButton = null // 清空当前选中的按钮
    button.checked = false // 设置按钮为未选中状态
  }

  // 获取当前选中的按钮
  public getSelectedButton() {
    return this.selectedButton
  }
}
