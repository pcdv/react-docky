import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  Modifier,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useDndContext,
  useDraggable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { ReactNode, RefCallback, useCallback, useId, useRef } from 'react'
import { BoxAction } from './reducer.js'
import { ITabs, IView } from './types.js'

/** What a drag source carries */
export interface DragData {
  item: IView | ITabs
  /** Applies the action of the drop zone the item is dropped on */
  onDrop: (action: BoxAction) => void
}

/** What a drop zone carries: the action that dropping `item` on it performs */
export interface DropData {
  drop: (item: IView | ITabs) => BoxAction
}

/**
 * Makes an element draggable, and tells whether it is being dragged.
 *
 * dnd-kit starts a drag from listeners meant to be spread as React props. The skin API hands out
 * a ref instead, so they are bound to the element as native listeners: dnd-kit only reads the
 * native event out of the synthetic one. When drag sources are nested, like tabs in a frame
 * footer, the innermost one marks the event and the others ignore it.
 */
export function useDragSource<T extends HTMLElement>(data: DragData): [boolean, RefCallback<T>] {
  const id = useId()
  const { setNodeRef, listeners, isDragging } = useDraggable({ id, data })
  const unbind = useRef<() => void>(null)

  const ref = useCallback<RefCallback<T>>(
    node => {
      unbind.current?.()
      unbind.current = null
      setNodeRef(node)
      if (!node || !listeners) return
      const native = Object.entries(listeners).map(([prop, listener]) => {
        const type = prop.slice(2).toLowerCase()
        const handler = (nativeEvent: Event) => listener({ nativeEvent })
        node.addEventListener(type, handler, { passive: true })
        return () => node.removeEventListener(type, handler)
      })
      unbind.current = () => native.forEach(remove => remove())
    },
    [setNodeRef, listeners]
  )

  return [isDragging, ref]
}

/** Where a pointer or a finger was when the drag started */
function startPoint(event: Event) {
  if ('touches' in event) {
    const touch = (event as TouchEvent).touches[0] ?? (event as TouchEvent).changedTouches[0]
    return { x: touch.clientX, y: touch.clientY }
  }
  const { clientX, clientY } = event as MouseEvent
  return { x: clientX, y: clientY }
}

/** Puts the preview above and to the right of the pointer, where a finger does not hide it */
const nextToPointer: Modifier = ({ transform, activatorEvent, activeNodeRect, overlayNodeRect }) => {
  if (!activatorEvent || !activeNodeRect) return transform
  const start = startPoint(activatorEvent)
  return {
    ...transform,
    x: transform.x + start.x - activeNodeRect.left + 12,
    y: transform.y + start.y - activeNodeRect.top - (overlayNodeRect?.height ?? 0) - 12,
  }
}

const label = (item: IView | ITabs): string => {
  if (item.type === 'view') return item.label || item.id
  const active = item.tabs[item.active ?? 0] ?? item.tabs[0]
  const more = item.tabs.length - 1
  return `${active ? label(active) : item.id}${more > 0 ? ` +${more}` : ''}`
}

const Preview = () => {
  const data = useDndContext().active?.data.current as DragData | undefined
  return data ? <div className="rd-drag-preview">{label(data.item)}</div> : null
}

/** Above the drop zones, see assets/index.css */
const PREVIEW_Z_INDEX = 100000000

const onDragEnd = ({ active, over }: DragEndEvent) => {
  const source = active.data.current as DragData | undefined
  const target = over?.data.current as DropData | undefined
  if (source && target) source.onDrop(target.drop(source.item))
}

/**
 * Lets views be dragged with a mouse, or with a finger after a short press so that a tap still
 * activates a tab and a swipe still scrolls.
 */
export const DragAndDrop = ({ children }: { children: ReactNode }) => {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  )
  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin} autoScroll={false} onDragEnd={onDragEnd}>
      {children}
      <DragOverlay
        dropAnimation={null}
        modifiers={[nextToPointer]}
        zIndex={PREVIEW_Z_INDEX}
        style={{ width: 'auto', height: 'auto' }}
      >
        <Preview />
      </DragOverlay>
    </DndContext>
  )
}
