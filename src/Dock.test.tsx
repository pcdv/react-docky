import { getByRole } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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
})
