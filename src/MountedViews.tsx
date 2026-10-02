import { useContext, useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { DockContext } from './Dock.js'
import { collectViews } from './layout.js'
import { IBox, IView, ViewRenderer } from './types.js'

/**
 * With keepViewsMounted, each view is rendered once into an element of its own, which is moved
 * to wherever the view is displayed: the view stays mounted when it is moved to another place or
 * when its tab is not active.
 */
export class ViewElements {
  private elements = new Map<string, HTMLDivElement>()

  /** The element of a view, created on first use */
  get(id: string): HTMLDivElement {
    let element = this.elements.get(id)
    if (!element) {
      element = document.createElement('div')
      element.className = 'rd-view'
      this.elements.set(id, element)
    }
    return element
  }

  /** Forgets the elements of the views that are no longer in the layout */
  retain(ids: Set<string>) {
    for (const id of this.elements.keys()) if (!ids.has(id)) this.elements.delete(id)
  }
}

/** Renders every view of the layout into its element */
export const MountedViews = ({ layout, elements }: { layout: IBox; elements: ViewElements }) => {
  const { render } = useContext(DockContext)
  const views = collectViews(layout)

  useEffect(() => elements.retain(new Set(views.map(v => v.id))))

  return views.map(view =>
    createPortal(<ViewContent render={render} view={view} />, elements.get(view.id), view.id)
  )
}

const ViewContent = ({ render, view }: { render: ViewRenderer; view: IView }) => render(view)

/** Where a view rendered by MountedViews is displayed */
export const ViewSlot = ({ view, elements }: { view: IView; elements: ViewElements }) => {
  const slot = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const parent = slot.current!
    const element = elements.get(view.id)
    parent.appendChild(element)
    return () => {
      if (element.parentNode === parent) parent.removeChild(element)
    }
  }, [elements, view.id])

  return <div className="rd-view-slot" ref={slot} />
}
