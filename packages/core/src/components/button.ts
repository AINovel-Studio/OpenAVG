import type { TextStyleFontWeight } from 'pixi.js'
import type { ButtonProps } from './buttonTypes'
import { Button } from '@pixi/ui'
import { Tween } from '@tweenjs/tween.js'
import {
  Graphics,
  Sprite,
  Text,
  TextStyle,
} from 'pixi.js'
import { centerView } from '../utils/layout'
import {
  handleDown,
  handleHover,
  handleOut,
  handlePress,
  handleUp,
  handleUpOut,
  setButtonFillColor,
} from './buttonInteractions'

export class CommonButton extends Button {
  private textView: Text
  private buttonView = new Sprite()
  action: (event: string) => void
  onClick: () => void
  private _checked = false
  onClickAfter: () => void

  box: Graphics
  tween: Tween
  colors: {
    default: string
    hover: string
    press: string
    disabled: string
  }

  type = 'round'
  size = 'middle'
  noGradient: boolean = false
  width = 200
  height = 60

  textOffset = { x: 0, y: 0 }

  set disable(newVal) {
    this.enabled = !newVal
    const color = !this.enabled ? this.colors.disabled : this.colors.default
    this.applyFillColor(color)
  }

  get disable() {
    return !this.enabled
  }

  constructor(props: ButtonProps) {
    super()
    this.view = this.buttonView
    this.noGradient = props.noGradient || false
    this.enabled = !props.disabled

    this.colors = {
      default: props.colors?.default || 'rgb(255, 228, 235, 0.8)',
      hover: props.colors?.hover || 'rgb(255, 200, 200, 1)',
      press: props.colors?.press || 'rgb(200, 0, 0, 1)',
      disabled: props.colors?.disable || 'rgb(180, 180, 180, 1)',
    }
    props.size && (this.size = props.size)
    props.type && (this.type = props.type)
    props.checked && (this.checked = props.checked)
    this.onClickAfter = props.onClickAfter || (() => null)

    props.textOffset
    && props.textOffset.x && (this.textOffset.x = props.textOffset.x)
    props.textOffset
    && props.textOffset.y && (this.textOffset.y = props.textOffset.y)

    let fontSize = 30
    if (this.size === 'big') {
      fontSize = 40
    } else if (this.size === 'small') {
      fontSize = 20
    }
    props.fontSize && (fontSize = props.fontSize)

    const box = new Graphics()
    this.box = box
    this.applyInitialFillColor(props)

    this.buttonView.addChild(box)

    const nameStyle = new TextStyle({
      fontFamily: 'Cochin',
      fontSize,
      fill: props.textColor || 'black',
      fontWeight: (props.fontWeight || 'bold') as TextStyleFontWeight,
    })

    this.textView = new Text({
      text: props.text,
      style: nameStyle,
    })

    if (this.type === 'text') {
      this.buttonView.removeChild(this.box)
      this.textView.position.set(0, 0)
    }

    centerView({
      view: this.textView,
      target: box,
      offset: this.textOffset,
    })

    this.buttonView.addChild(this.textView)
    this.tween = new Tween(this.buttonView.scale)

    if (props.action) {
      this.action = props.action
    }
    if (props.onClick) {
      this.onClick = props.onClick
    }
  }

  get checked() {
    return this._checked
  }

  set checked(newVal) {
    this._checked = newVal
    const color = newVal ? this.colors.press : this.colors.default
    this.applyFillColor(color)
  }

  private applyInitialFillColor(props: ButtonProps) {
    if (!this.enabled) {
      this.applyFillColor(this.colors.disabled, props.width, props.height)
    } else if (this.checked) {
      this.applyFillColor(this.colors.press, props.width, props.height)
    } else {
      this.applyFillColor(this.colors.default, props.width, props.height)
    }
  }

  applyFillColor(color: string, width?: number, height?: number) {
    const result = setButtonFillColor(this, color, width, height)
    this.width = result.width
    this.height = result.height
  }

  override down() {
    handleDown(this)
  }

  override up() {
    handleUp(this)
  }

  override upOut() {
    handleUpOut(this)
  }

  override out() {
    handleOut(this)
  }

  override press() {
    handlePress(this)
  }

  override hover() {
    handleHover(this)
  }
}
