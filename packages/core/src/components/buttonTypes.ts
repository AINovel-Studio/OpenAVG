export interface ButtonProps {
  text: string
  textColor?: string
  disabled?: boolean
  onClick: () => void
  onClickAfter?: () => void
  action?: (event: string) => void
  colors?: {
    disable?: string
    default?: string
    hover?: string
    press?: string
  }
  height?: number
  width?: number
  size?: SizeType
  type?: TypeType
  fontSize?: number
  fontWeight?: string
  backgroundColor?: string
  noGradient?: boolean
  textOffset?: { x?: number, y?: number }
  checked?: boolean
}

export type SizeType = 'big' | 'middle' | 'small'
export type TypeType = 'round' | 'rectangle' | 'text'

export interface ButtonColors {
  default: string
  hover: string
  press: string
  disabled: string
}
