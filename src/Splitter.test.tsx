import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Splitter } from './Splitter.js'

/** A horizontal splitter 400px wide, whose first pane is 200px wide */
function renderSplitter() {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const width = this.classList.contains('rd-split') ? 400 : 200
    return { left: 0, top: 0, width, height: 300 } as DOMRect
  })
  const onResized = vi.fn()
  const { container } = render(
    <Splitter orientation="horizontal" onResized={onResized}>
      <div />
      <div />
    </Splitter>
  )
  const split = container.querySelector<HTMLElement>('.rd-split')!
  const resizer = container.querySelector('.Resizer')!
  return { onResized, split, resizer }
}

describe('Splitter', () => {
  it('resizes by the distance the resizer is dragged', () => {
    const { onResized, split, resizer } = renderSplitter()

    fireEvent.pointerDown(resizer, { button: 0, clientX: 100, pointerId: 1 })
    fireEvent.pointerMove(resizer, { clientX: 160, pointerId: 1 })
    expect(split.style.getPropertyValue('--rd-split-at')).toBe('260px')
    expect(resizer.hasAttribute('data-dragging')).toBe(true)
    expect(onResized).not.toHaveBeenCalled()

    fireEvent.pointerUp(resizer, { clientX: 160, pointerId: 1 })
    expect(onResized).toHaveBeenCalledExactlyOnceWith(260)
    expect(resizer.hasAttribute('data-dragging')).toBe(false)
  })

  it('keeps both panes at least 50px', () => {
    const { onResized, resizer } = renderSplitter()

    fireEvent.pointerDown(resizer, { button: 0, clientX: 100, pointerId: 1 })
    fireEvent.pointerUp(resizer, { clientX: 1000, pointerId: 1 })
    fireEvent.pointerDown(resizer, { button: 0, clientX: 100, pointerId: 1 })
    fireEvent.pointerUp(resizer, { clientX: -1000, pointerId: 1 })

    expect(onResized.mock.calls).toEqual([[350], [50]])
  })

  it('splits evenly on double click', () => {
    const { onResized, resizer } = renderSplitter()
    fireEvent.doubleClick(resizer)
    expect(onResized).toHaveBeenCalledExactlyOnceWith(undefined)
  })

  it('only resizes with the main button', () => {
    const { onResized, resizer } = renderSplitter()
    fireEvent.pointerDown(resizer, { button: 2, clientX: 100, pointerId: 1 })
    fireEvent.pointerUp(resizer, { clientX: 160, pointerId: 1 })
    expect(onResized).not.toHaveBeenCalled()
  })
})
