import { act, fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import { vi } from 'vitest'
import { Dock, DockProps } from './Dock.js'
import { IBox, ITabs, IView } from './types.js'

export const view = (id: string): IView => ({ type: 'view', id, viewType: 'test' })

export const tabs = (id: string, viewIds: string[], active?: number): ITabs => ({
  type: 'tabs',
  id,
  tabs: viewIds.map(view),
  active,
})

/**
 * Renders a controlled Dock, with the default skin and each view as an element with the test id
 * `view-<id>`, unless other props are given.
 */
export function renderDock(initial: IBox, props: Partial<DockProps> = {}) {
  let layout = initial
  let setLayout: (layout: IBox) => void = () => {}

  const Harness = () => {
    const [state, setState] = useState(initial)
    setLayout = setState
    return (
      <Dock
        state={state}
        onChange={s => setState((layout = s))}
        render={v => <div data-testid={`view-${v.id}`} />}
        {...props}
      />
    )
  }

  const result = render(<Harness />)
  return {
    ...result,
    /** The layout last reported by onChange */
    layout: () => layout,
    /** Replaces the layout, as the application could */
    setLayout: (newLayout: IBox) => act(() => setLayout((layout = newLayout))),
  }
}

/** Where the drop target is laid out: jsdom lays out nothing, every other element is at 0, 0 */
const TARGET = { left: 100, top: 100, width: 10, height: 10 }
const IN_TARGET = { clientX: 105, clientY: 105 }

/**
 * Gives the element returned by `target` the bounds TARGET when dnd-kit measures drop zones.
 * It is looked up then, as drop zones are only rendered once a drag has started.
 */
function layOutTarget(target: () => Element) {
  const original = Element.prototype.getBoundingClientRect
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    let isTarget = false
    try {
      isTarget = this === target()
    } catch {
      // Not rendered yet
    }
    if (!isTarget) return original.call(this)
    const { left, top, width, height } = TARGET
    return { left, top, width, height, x: left, y: top, right: left + width, bottom: top + height } as DOMRect
  })
}

/**
 * Drags `source` with the mouse and drops it on the element returned by `target`, which is only
 * looked up once the drag has started: drop zones are not rendered before.
 */
export function dragAndDrop(source: Element, target: () => Element) {
  layOutTarget(target)
  fireEvent.mouseDown(source, { button: 0, clientX: 0, clientY: 0 })
  fireEvent.mouseMove(document, IN_TARGET)
  fireEvent.mouseMove(document, IN_TARGET)
  fireEvent.mouseUp(document, IN_TARGET)
}

/**
 * Drags `source` with a finger, which takes holding it still first, and drops it on the element
 * returned by `target`. Needs fake timers.
 */
export function touchDragAndDrop(source: Element, target: () => Element) {
  layOutTarget(target)
  const at = (point: { clientX: number; clientY: number }) => ({ touches: [point], changedTouches: [point] })
  fireEvent.touchStart(source, at({ clientX: 0, clientY: 0 }))
  act(() => vi.advanceTimersByTime(300))
  fireEvent.touchMove(source, at(IN_TARGET))
  fireEvent.touchMove(source, at(IN_TARGET))
  fireEvent.touchEnd(source, { touches: [], changedTouches: [IN_TARGET] })
}

/** The frame (default skin, or with the same class) that contains the active view `viewId` */
export const frameOf = (getByTestId: (id: string) => HTMLElement, viewId: string) =>
  getByTestId(`view-${viewId}`).closest('.views-container')!

/** A drop zone over the active view `viewId`, for instance `left` or `over` */
export const dropZoneOver = (
  getByTestId: (id: string) => HTMLElement,
  viewId: string,
  position: string
) => getByTestId(`view-${viewId}`).closest('.view-wrapper')!.querySelector(`:scope > .dz-trigger.${position}`)!
