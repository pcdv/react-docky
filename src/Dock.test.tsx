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
})
