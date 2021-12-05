import React, { CSSProperties } from 'react'
import { FrameProps, useDragTabs } from '.'
import { Footer } from './Footer'
import { Header } from './Header'

const INVISIBLE: CSSProperties = { display: 'none' }

export const DefaultFrame = (p: FrameProps) => {
  const [{ isTabsDragging: headerDragging }, headerDrag] = useDragTabs(p.tabs, p.onDrop)
  const [{ isTabsDragging: footerDragging }, footerDrag] = useDragTabs(p.tabs, p.onDrop)

  return (
    <div
      className="views-container"
      style={headerDragging || footerDragging ? INVISIBLE : undefined}
    >
      <Header view={p.view} dragTabsRef={headerDrag} onClose={p.onCloseAll} />
      {p.viewWrapper}
      <Footer tabs={p.tabs} dragTabsRef={footerDrag} active={p.active} onActivate={p.onActivate} />
    </div>
  )
}
