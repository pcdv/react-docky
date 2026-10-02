import { fireEvent, getByRole, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Dock } from './Dock.js'
import { FrameProps, useDragTabs } from './skin/index.js'
import { IBox } from './types.js'
import { repr } from './util.js'
import { dragAndDrop, dropZoneOver, frameOf, renderDock, tabs } from './test-utils.js'

describe('Dragging views', () => {
  it('drops on a view according to the current orientation of its box', () => {
    const B: IBox = {
      type: 'box',
      id: 'B',
      orientation: 'horizontal',
      one: tabs('T1', ['t1']),
      two: tabs('T2', ['t2']),
    }
    const dock = renderDock({ type: 'box', id: 'R', orientation: 'vertical', one: B, two: tabs('T3', ['w']) })

    // What dropping T1 on the top edge of B does: B is now vertical, T1 and T2 stay mounted
    dock.setLayout({ ...dock.layout(), one: { ...B, orientation: 'vertical' } })

    dragAndDrop(getByRole(frameOf(dock.getByTestId, 'w') as HTMLElement, 'button', { name: 'w' }), () =>
      dropZoneOver(dock.getByTestId, 't2', 'left')
    )

    expect(repr(dock.layout())).toBe('v(t1, h(w, t2))')
  })

  it('drags a tab group with its current tabs', () => {
    const dock = renderDock({
      type: 'box',
      id: 'B',
      orientation: 'horizontal',
      one: tabs('T1', ['a', 'b', 'c'], 0),
      two: tabs('T2', ['x']),
    })

    // c moves to T2, while T1 stays mounted as its active tab does not change
    dock.setLayout({ ...dock.layout(), one: tabs('T1', ['a', 'b'], 0), two: tabs('T2', ['x', 'c'], 1) })

    dragAndDrop(frameOf(dock.getByTestId, 'a').querySelector('.rd-frame-header')!, () =>
      dropZoneOver(dock.getByTestId, 'c', 'over')
    )

    expect(repr(dock.layout())).toBe('h(x-c-a-b, null)')
  })

  it('does not drop a tab group on itself', () => {
    // Unlike the default one, this frame stays visible while it is dragged
    const VisibleFrame = (p: FrameProps) => {
      const [, drag] = useDragTabs(p.tabs, p.onDrop)
      return (
        <div className="views-container">
          <div className="rd-frame-header" ref={drag} />
          {p.viewWrapper}
        </div>
      )
    }
    const dock = renderDock(
      { type: 'box', id: 'B', orientation: 'horizontal', one: tabs('T1', ['a', 'b']), two: tabs('T2', ['x']) },
      VisibleFrame
    )

    dragAndDrop(frameOf(dock.getByTestId, 'a').querySelector('.rd-frame-header')!, () =>
      dropZoneOver(dock.getByTestId, 'a', 'over')
    )

    expect(repr(dock.layout())).toBe('h(a-b, x)')
  })
})

describe('Uncontrolled dock', () => {
  it('reports the new layout to onChange', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      const width = this.classList.contains('rd-split') ? 400 : 200
      return { left: 0, top: 0, width, height: 300 } as DOMRect
    })
    const initialState: IBox = {
      type: 'box',
      id: 'B',
      orientation: 'horizontal',
      one: tabs('T1', ['a']),
      two: tabs('T2', ['b']),
    }
    const onChange = vi.fn()
    const { container } = render(
      <Dock initialState={initialState} onChange={onChange} render={v => <div>{v.id}</div>} />
    )

    const resizer = container.querySelector('.Resizer')!
    fireEvent.pointerDown(resizer, { button: 0, clientX: 200, pointerId: 1 })
    fireEvent.pointerMove(resizer, { clientX: 250, pointerId: 1 })
    fireEvent.pointerUp(resizer, { clientX: 250, pointerId: 1 })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toMatchObject({ id: 'B', size: 250 })
  })
})
