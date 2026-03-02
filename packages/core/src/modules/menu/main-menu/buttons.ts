import type { Sprite } from 'pixi.js'
import type { CommonButton } from '@/components/button'

import type { SaveDataList } from '@/types'
import { ButtonContainer } from '@pixi/ui'

import { CommonButton as CommonButtonClass } from '@/components/button'
import { openAVGCore } from '@/index'
import { tickerManager } from '@/managers/ticker-manager'
import { getSaveDataList } from '@/utils/gameStorage'
import { centerView, row } from '@/utils/layout'
import { actions } from './actions'

export interface ButtonRows {
  row1: CommonButton[]
  row2: CommonButton[]
}

export function createDefaultButtons(saveDataList: SaveDataList): ButtonRows {
  const continueBtn = new CommonButtonClass({
    text: 'Continue',
    disabled: !(saveDataList && saveDataList[0]),
    size: 'big',
    onClick: () => actions.onContinue(saveDataList[0]),
  })
  const startBtn = new CommonButtonClass({
    text: 'Start',
    size: 'big',
    onClick: () => actions.onStart(),
  })
  const loadBtn = new CommonButtonClass({
    text: 'Load',
    size: 'big',
    onClick: () => actions.onLoad(true),
  })

  const afStoryBtn = new CommonButtonClass({
    text: 'AfterStory',
    size: 'big',
    disabled: true,
    onClick: () => actions.onAFStory(),
  })
  const galleryBtn = new CommonButtonClass({
    text: 'Gallery',
    size: 'big',
    disabled: true,
    onClick: () => actions.onGallery(),
  })
  const configBtn = new CommonButtonClass({
    text: 'Config',
    size: 'big',
    // disabled: true,
    onClick: () => actions.onConfig(),
  })
  const ExitBtn = new CommonButtonClass({
    text: 'Exit',
    size: 'big',
    onClick: () => actions.onExit(),
  })
  return {
    row1: [continueBtn, startBtn, loadBtn],
    row2: [afStoryBtn, galleryBtn, configBtn, ExitBtn],
  }
}

export function renderButtons(mainMenu: any, { row1, row2 }: ButtonRows) {
  const btnRow1Container = new ButtonContainer()
  const btnRow2Container = new ButtonContainer()

  btnRow1Container.position.y = 750
  btnRow2Container.position.y = 900

  const btnSpriteRow1 = row1.map((btn, idx) => {
    tickerManager.addListener(`btnRow1InMainMenu-${idx}`, () => btn.tween.update())
    return btn.view as Sprite
  })
  const btnSpriteRow2 = row2.map((btn, idx) => {
    tickerManager.addListener(`btnRow2InMainMenu-${idx}`, () => btn.tween.update())
    return btn.view as Sprite
  })

  row(btnSpriteRow1, 400)
  row(btnSpriteRow2, 400)

  btnSpriteRow1.forEach(btn => btnRow1Container.addChild(btn))
  btnSpriteRow2.forEach(btn => btnRow2Container.addChild(btn))

  centerView({
    pos: 'x',
    view: btnRow1Container,
    target: mainMenu.container,
  })
  centerView({
    pos: 'x',
    view: btnRow2Container,
    target: mainMenu.container,
  })
  mainMenu.container.addChild(btnRow1Container)
  mainMenu.container.addChild(btnRow2Container)

  mainMenu.btnRefresh = async () => {
    const saveDataList = await getSaveDataList(openAVGCore.gameTitle)

    row1[0].disable = !(saveDataList && saveDataList[0])
    row1[0].onClick = () => actions.onContinue(saveDataList[0])
    console.log(row1[0].enabled, row1[0].enabled)

    row1.forEach((btn, idx) => {
      if (tickerManager.hasListener(`btnRow1InMainMenu-${idx}`)) {
        tickerManager.removeListener(`btnRow1InMainMenu-${idx}`)
      }
      tickerManager.addListener(`btnRow1InMainMenu-${idx}`, () => btn.tween.update())
    })
    row2.forEach((btn, idx) => {
      if (tickerManager.hasListener(`btnRow2InMainMenu-${idx}`)) {
        tickerManager.removeListener(`btnRow2InMainMenu-${idx}`)
      }
      tickerManager.addListener(`btnRow2InMainMenu-${idx}`, () => btn.tween.update())
    })
  }
}
