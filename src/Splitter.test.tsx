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

describe('Uncontrolled splitter', () => {
  /** A horizontal splitter 400px wide, whose first pane is 100px wide */
  function renderUncontrolled(defaultSize: string | number) {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: Element
    ) {
      const width = this.classList.contains('rd-split') ? 400 : 100
      return { left: 0, top: 0, width, height: 300 } as DOMRect
    })
    const { container } = render(
      <Splitter orientation="horizontal" defaultSize={defaultSize}>
        <div />
        <div />
      </Splitter>
    )
    const split = container.querySelector<HTMLElement>('.rd-split')!
    return {
      split,
      resizer: container.querySelector('.Resizer')!,
      at: () => split.style.getPropertyValue('--rd-split-at'),
    }
  }

  it('starts at the default size, in any CSS length', () => {
    expect(renderUncontrolled('25%').at()).toBe('25%')
  })

  it('keeps a size in percent if the default size is one', () => {
    const { resizer, at } = renderUncontrolled('25%')
    fireEvent.pointerDown(resizer, { button: 0, clientX: 100, pointerId: 1 })
    fireEvent.pointerUp(resizer, { clientX: 160, pointerId: 1 })
    expect(at()).toBe('40%')

    fireEvent.doubleClick(resizer)
    expect(at()).toBe('25%')
  })

  it('keeps a size in pixels otherwise', () => {
    const { resizer, at } = renderUncontrolled(100)
    fireEvent.pointerDown(resizer, { button: 0, clientX: 100, pointerId: 1 })
    fireEvent.pointerUp(resizer, { clientX: 160, pointerId: 1 })
    expect(at()).toBe('160px')
  })
})

describe('Controlled splitter', () => {
  it('shows the size it is given', () => {
    const { container, rerender } = render(
      <Splitter orientation="vertical" size={120} onResized={() => {}}>
        <div />
        <div />
      </Splitter>
    )
    const split = container.querySelector<HTMLElement>('.rd-split')!
    expect(split.style.getPropertyValue('--rd-split-at')).toBe('120px')
    rerender(
      <Splitter orientation="vertical" size="30%" onResized={() => {}}>
        <div />
        <div />
      </Splitter>
    )
    expect(split.style.getPropertyValue('--rd-split-at')).toBe('30%')
  })
})
