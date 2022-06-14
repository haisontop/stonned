import React, { CSSProperties, FC, MouseEvent, ReactElement } from 'react'

export interface ButtonProps {
  className?: string
  disabled?: boolean
  endIcon?: ReactElement
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  starticon?: ReactElement
  style?: CSSProperties
  tabIndex?: number
}

export const Button: FC<ButtonProps> = (props) => {
  return (
    <button
      className={`wallet-adapter-button ${props.className || ''}`}
      disabled={props.disabled}
      onClick={props.onClick}
      tabIndex={props.tabIndex || 0}
      type='button'
    >
      {props.starticon && (
        <i className='wallet-adapter-button-start-icon'>{props.starticon}</i>
      )}
      {props.children}
      {props.endIcon && (
        <i className='wallet-adapter-button-end-icon'>{props.endIcon}</i>
      )}
    </button>
  )
}
