import React from 'react'
import { HeaderProps } from '.'

export const Header = ({ view, dragTabsRef: drag, onClose }: HeaderProps) => {
  return (
    <div className="rd-frame-header" ref={drag}>
      <div>{view.label || view.id}</div>
      <button onClick={onClose}>{'\u2573'}</button>
    </div>
  )
}
