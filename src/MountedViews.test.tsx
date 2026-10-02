import { fireEvent, getByRole } from '@testing-library/react'
import { useEffect, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { IBox, IView } from './types.js'
import { repr } from './util.js'
import { dragAndDrop, dropZoneOver, frameOf, renderDock, tabs } from './test-utils.js'

const unmounted = vi.fn()

/** A view with some state */
const Counter = ({ id }: { id: string }) => {
  const [count, setCount] = useState(0)
  useEffect(() => () => unmounted(id), [id])
  return (
    <button data-testid={`view-${id}`} onClick={() => setCount(count + 1)}>
      {count}
    </button>
  )
}

const render = (view: IView) => <Counter id={view.id} />

const sideBySide: IBox = {
  type: 'box',
  id: 'B',
  orientation: 'horizontal',
  one: tabs('T1', ['a']),
  two: tabs('T2', ['b']),
}

/** a moved below b, into another box */
const moved: IBox = {
  type: 'box',
  id: 'R',
  orientation: 'vertical',
  one: tabs('T2', ['b']),
  two: { type: 'box', id: 'B2', orientation: 'horizontal', one: tabs('T1', ['a']), two: tabs('T3', ['c']) },
}

function clickTwice(element: HTMLElement) {
  fireEvent.click(element)
  fireEvent.click(element)
}

describe('keepViewsMounted', () => {
  it('keeps the state of a view moved to another place', () => {
    const dock = renderDock(sideBySide, { render, keepViewsMounted: true })
    clickTwice(dock.getByTestId('view-a'))

    dock.setLayout(moved)

    expect(dock.getByTestId('view-a').textContent).toBe('2')
  })

  it('is needed to keep the state of a moved view', () => {
    const dock = renderDock(sideBySide, { render })
    clickTwice(dock.getByTestId('view-a'))

    dock.setLayout(moved)

    expect(dock.getByTestId('view-a').textContent).toBe('0')
  })

  it('keeps the state of a view in an inactive tab', () => {
    const dock = renderDock({ ...sideBySide, one: tabs('T1', ['a', 'x'], 0) }, { render, keepViewsMounted: true })
    clickTwice(dock.getByTestId('view-a'))

    dock.setLayout({ ...sideBySide, one: tabs('T1', ['a', 'x'], 1) })
    expect(dock.queryByTestId('view-a')).toBeNull() // not displayed, but still mounted
    dock.setLayout({ ...sideBySide, one: tabs('T1', ['a', 'x'], 0) })

    expect(dock.getByTestId('view-a').textContent).toBe('2')
  })

  it('unmounts a view removed from the layout', () => {
    unmounted.mockClear()
    const dock = renderDock(sideBySide, { render, keepViewsMounted: true })

    dock.setLayout({ type: 'box', id: 'B', orientation: 'horizontal', one: tabs('T2', ['b']) })

    expect(unmounted.mock.calls).toEqual([['a']])
    expect(dock.queryByTestId('view-a')).toBeNull()
  })

  it('drops on views kept mounted', () => {
    const dock = renderDock(
      { type: 'box', id: 'R', orientation: 'vertical', one: sideBySide, two: tabs('T3', ['w']) },
      { render, keepViewsMounted: true }
    )
    clickTwice(dock.getByTestId('view-w'))

    dragAndDrop(getByRole(frameOf(dock.getByTestId, 'w') as HTMLElement, 'button', { name: 'w' }), () =>
      dropZoneOver(dock.getByTestId, 'b', 'left')
    )

    expect(repr(dock.layout())).toBe('h(a, h(w, b))')
    expect(dock.getByTestId('view-w').textContent).toBe('2')
  })
})
