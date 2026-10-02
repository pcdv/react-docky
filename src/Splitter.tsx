import { CSSProperties, PointerEvent, ReactNode, useRef, useState } from 'react'
import { Orientation } from './types.js'

/** Smallest size of a pane, in pixels. Keep in sync with assets/index.css. */
export const MIN_PANE_SIZE = 50

export interface SplitterProps {
  /** 'horizontal' puts the panes side by side, 'vertical' stacks them */
  orientation: Orientation
  /**
   * Size of the first pane, in pixels or as any CSS length such as '20%'. When set, it is up to
   * the application to change it in onResized.
   */
  size?: number | string
  /**
   * Size of the first pane until the user resizes it, when `size` is not set: '50%' by default.
   * If it is a percentage, the size set by the user is kept as a percentage too.
   */
  defaultSize?: number | string
  /**
   * Called once the user is done resizing, with the new size in pixels, or with undefined after
   * a double-click on the resizer, which goes back to defaultSize.
   */
  onResized?: (size: number | undefined) => void
  /** Classes to add to the container */
  className?: string
  children: [ReactNode, ReactNode]
}

const cssLength = (size: number | string) => (typeof size === 'number' ? `${size}px` : size)

/**
 * Two panes separated by a resizer that can be dragged, or double-clicked to restore the initial
 * size. Splitters can be nested.
 *
 * The resizer has the classes `Resizer vertical` (between panes side by side) or
 * `Resizer horizontal`, like react-split-pane had, and the attribute `data-dragging`
 * while it is being dragged.
 */
export const Splitter = ({
  orientation,
  size,
  defaultSize = '50%',
  onResized,
  className,
  children,
}: SplitterProps) => {
  const horizontal = orientation === 'horizontal'
  const drag = useRef<{ start: number; from: number } | null>(null)
  const [dragSize, setDragSize] = useState<number>()
  const [resized, setResized] = useState<number | string>()

  const position = (e: PointerEvent) => (horizontal ? e.clientX : e.clientY)

  /** The size of the first pane at the position of the pointer, and the size of both */
  const measure = (e: PointerEvent<HTMLElement>) => {
    const { start, from } = drag.current!
    const container = e.currentTarget.parentElement!.getBoundingClientRect()
    const total = horizontal ? container.width : container.height
    const size = Math.round(
      Math.max(MIN_PANE_SIZE, Math.min(total - MIN_PANE_SIZE, start + position(e) - from))
    )
    return { size, total }
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
    if (drag.current) setDragSize(measure(e).size)
  }

  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    if (!drag.current) return
    const { size, total } = measure(e)
    drag.current = null
    setDragSize(undefined)
    const inPercent = typeof defaultSize === 'string' && defaultSize.trim().endsWith('%')
    setResized(inPercent && total ? `${Math.round((size * 10000) / total) / 100}%` : size)
    onResized?.(size)
  }

  const onDoubleClick = () => {
    setResized(undefined)
    onResized?.(undefined)
  }

  const splitAt = dragSize ?? size ?? resized ?? defaultSize
  const style = { '--rd-split-at': cssLength(splitAt) } as CSSProperties

  return (
    <div className={`rd-split ${orientation} ${className ?? ''}`.trim()} style={style}>
      <div className="rd-pane first">{children[0]}</div>
      <div
        className={`Resizer ${horizontal ? 'vertical' : 'horizontal'}`}
        data-dragging={dragSize === undefined ? undefined : ''}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onLostPointerCapture={onPointerUp}
        onDoubleClick={onDoubleClick}
      />
      <div className="rd-pane second">{children[1]}</div>
    </div>
  )
}
