import { act, fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import { Dock } from './Dock.js'
import { IBox, ITabs, IView } from './types.js'

export const view = (id: string): IView => ({ type: 'view', id, viewType: 'test' })

export const tabs = (id: string, viewIds: string[], active?: number): ITabs => ({
  type: 'tabs',
  id,
  tabs: viewIds.map(view),
  active,
})

/**
 * Renders a controlled Dock with the default skin. Each view renders as an element with the
 * test id `view-<id>`.
 */
export function renderDock(initial: IBox) {
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

const dataTransfer = {
  dropEffect: 'move',
  effectAllowed: 'all',
  types: [],
  setData: () => {},
  getData: () => '',
  setDragImage: () => {},
}

/**
 * Drags `source` and drops it on the element returned by `target`, which is only looked up once
 * the drag has started: drop zones are not rendered before.
 */
export function dragAndDrop(source: Element, target: () => Element) {
  fireEvent.dragStart(source, { dataTransfer })
  const dropTarget = target()
  fireEvent.dragEnter(dropTarget, { dataTransfer })
  fireEvent.dragOver(dropTarget, { dataTransfer })
  fireEvent.drop(dropTarget, { dataTransfer })
  fireEvent.dragEnd(source, { dataTransfer })
}

/** The frame (default skin) that contains the active view `viewId` */
export const frameOf = (getByTestId: (id: string) => HTMLElement, viewId: string) =>
  getByTestId(`view-${viewId}`).closest('.views-container')!

/** A drop zone over the active view `viewId`, for instance `left` or `over` */
export const dropZoneOver = (
  getByTestId: (id: string) => HTMLElement,
  viewId: string,
  position: string
) => getByTestId(`view-${viewId}`).parentElement!.querySelector(`.dz-trigger.${position}`)!
