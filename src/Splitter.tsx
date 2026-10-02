import React, { CSSProperties, PointerEvent, ReactNode, useRef, useState } from 'react'
import { Orientation } from './types'

/** Smallest size of a pane, in pixels. Keep in sync with assets/index.css. */
export const MIN_PANE_SIZE = 50

interface SplitterProps {
  /** 'horizontal' puts the panes side by side, 'vertical' stacks them */
  orientation: Orientation
  /** Size of the first pane in pixels, or undefined to split evenly */
  size?: number
  /** Called once the user is done resizing, with undefined to go back to an even split */
  onResized: (size: number | undefined) => void
  children: [ReactNode, ReactNode]
}

/**
 * Two panes separated by a resizer that can be dragged, or double-clicked to split evenly.
 *
 * The resizer has the classes `Resizer vertical` (between panes side by side) or
 * `Resizer horizontal`, like react-split-pane had, and the attribute `data-dragging`
 * while it is being dragged.
 */
export const Splitter = ({ orientation, size, onResized, children }: SplitterProps) => {
  const horizontal = orientation === 'horizontal'
  const drag = useRef<{ start: number; from: number } | null>(null)
  const [dragSize, setDragSize] = useState<number>()

  const position = (e: PointerEvent) => (horizontal ? e.clientX : e.clientY)

  const sizeAt = (e: PointerEvent<HTMLElement>) => {
    const { start, from } = drag.current!
    const container = e.currentTarget.parentElement!.getBoundingClientRect()
    const max = (horizontal ? container.width : container.height) - MIN_PANE_SIZE
    return Math.round(Math.max(MIN_PANE_SIZE, Math.min(max, start + position(e) - from)))
  }

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    const first = e.currentTarget.previousElementSibling!.getBoundingClientRect()
    drag.current = { start: horizontal ? first.width : first.height, from: position(e) }
    setDragSize(drag.current.start)
  }

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (drag.current) setDragSize(sizeAt(e))
  }

  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    if (!drag.current) return
    const newSize = sizeAt(e)
    drag.current = null
    setDragSize(undefined)
    onResized(newSize)
  }

  const splitAt = dragSize ?? size
  const style = { '--rd-split-at': splitAt === undefined ? '50%' : `${splitAt}px` } as CSSProperties

  return (
    <div className={`rd-split ${orientation}`} style={style}>
      <div className="rd-pane first">{children[0]}</div>
      <div
        className={`Resizer ${horizontal ? 'vertical' : 'horizontal'}`}
        data-dragging={dragSize === undefined ? undefined : ''}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onLostPointerCapture={onPointerUp}
        onDoubleClick={() => onResized(undefined)}
      />
      <div className="rd-pane second">{children[1]}</div>
    </div>
  )
}
