import { ReactElement, RefCallback, useContext } from 'react'
import { DockContext } from '../Dock.js'
import { useDragSource } from '../drag.js'
import { BoxAction } from '../reducer.js'
import { ITabs, IView } from '../types.js'

/**
 * If you want to provide your own look and feel, you must provide a render prop that
 * accepts these props.
 */
export interface FrameProps {
  /** Active view meta-data */
  view: IView
  /** Tabbed views meta-data */
  tabs: ITabs
  /** Active view index (in tabs). Should be same as tabs.active */
  active: number
  /** Action triggered when views are dropped on the frame. Must be fed to useDragTabs() to obtain drag refs */
  onDrop: (action: BoxAction) => void
  /** Callback to close all tabs */
  onCloseAll: () => void
  /** Callback to close one tab */
  onCloseTab: (i: number) => void
  /** Callback to activate the i-th tab */
  onActivate: (i: number) => void
  /** The active view component */
  viewWrapper: ReactElement
}

export interface HeaderProps {
  view: IView
  dragTabsRef: RefCallback<HTMLElement>
  onClose: () => void
}

export interface FooterProps {
  tabs: ITabs
  active: number
  dragTabsRef: RefCallback<HTMLElement>
  onActivate: (i: number) => void
}

export interface TabProps {
  view: IView
  active: boolean
  onActivate: () => void
  onClose: () => void
}

/**
 * Hook returning the ref to pass to the component which should be dragged to move a view.
 */
export function useDragTab<T extends HTMLElement = HTMLElement>(view: IView): RefCallback<T> {
  const { dispatch, state } = useContext(DockContext)
  const [, drag] = useDragSource<T>({ item: view, onDrop: action => dispatch(action, state.current) })
  return drag
}

/** @deprecated Renamed to useDragTab, as it is a hook */
export const dragTab = useDragTab

/**
 * Hook to make a tabbed view draggable. Usage:
 *     const [{ isTabsDragging }, drag] = useDragTabs(tabs, onDrop)
 *     return <div ref={drag} className="my-tabbed-view">...</div>
 */
export function useDragTabs<T extends HTMLElement = HTMLElement>(
  tabs: ITabs,
  onDrop: (action: BoxAction) => void
) {
  const [isTabsDragging, drag] = useDragSource<T>({ item: tabs, onDrop })
  return [{ isTabsDragging }, drag] as const
}
