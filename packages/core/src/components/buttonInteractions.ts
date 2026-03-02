import { Easing } from '@tweenjs/tween.js'
import { Color, FillGradient } from 'pixi.js'
import { debounce } from '../utils/debounce'

interface InteractionTarget {
  type: string
  size: string
  width: number
  height: number
  enabled: boolean
  checked: boolean
  noGradient: boolean
  box: any
  tween: any
  colors: {
    default: string
    hover: string
    press: string
    disabled: string
  }
  action?: (event: string) => void
  onClick: () => void
  onClickAfter: () => void
}

export function setButtonFillColor(
  target: InteractionTarget,
  color: string,
  width?: number,
  height?: number,
): { width: number, height: number } {
  if (target.type === 'text')
    return { width: target.width, height: target.height }

  const radius = target.type === 'round' ? 100 : 0
  let w = target.width
  let h = target.height

  if (target.size === 'small') {
    w = 100
    h = 40
  } else if (target.size === 'big') {
    w = 300
    h = 80
  }

  width && (w = width)
  height && (h = height)

  const boxReact = { width: w, height: h, radius }

  if (target.box) {
    target.box.clear()
    if (target.noGradient) {
      target.box.beginFill(new Color(color))
        .roundRect(0, 0, boxReact.width, boxReact.height, boxReact.radius)
        .endFill()
    } else {
      const gradientFill = new FillGradient(0, 0, 0, 80)
      if (!target.enabled) {
        gradientFill.addColorStop(0, new Color(color))
      } else {
        gradientFill.addColorStop(0, new Color('rgb(255, 228, 235, 0.6)'))
      }
      gradientFill.addColorStop(1, new Color(color))
      target.box.roundRect(0, 0, boxReact.width, boxReact.height, boxReact.radius)
        .fill(gradientFill)
    }
  }

  return { width: w, height: h }
}

function resetScale(target: InteractionTarget) {
  target.tween.stop()
  target.tween.to({ x: 1, y: 1 }).easing(Easing.Back.Out).start()
}

function resolveColor(target: InteractionTarget): string {
  return target.checked ? target.colors.press : target.colors.default
}

export function handleDown(target: InteractionTarget) {
  resetScale(target)
  setButtonFillColor(target, target.colors.press, target.width, target.height)
  target.action?.('down')
}

export function handleUp(target: InteractionTarget) {
  resetScale(target)
  setButtonFillColor(target, resolveColor(target), target.width, target.height)
  target.action?.('up')
}

export function handleUpOut(target: InteractionTarget) {
  resetScale(target)
  setButtonFillColor(target, resolveColor(target), target.width, target.height)
  target.action?.('upOut')
}

export function handleOut(target: InteractionTarget) {
  resetScale(target)
  setButtonFillColor(target, resolveColor(target), target.width, target.height)
  target.action?.('out')
}

export function handlePress(target: InteractionTarget) {
  resetScale(target)
  setButtonFillColor(target, target.colors.press, target.width, target.height)
  target.action?.('onPress')

  ;(debounce(() => {
    target.onClick()
    target.onClickAfter()
  }, 100))()
}

export function handleHover(target: InteractionTarget) {
  target.tween.stop()
  target.tween.to({ x: 1.02, y: 1.02 }).easing(Easing.Back.Out).start()
  setButtonFillColor(target, target.colors.hover, target.width, target.height)
  target.action?.('hover')
}
