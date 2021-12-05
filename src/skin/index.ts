import { ReactElement, useContext } from 'react'
import { ConnectDragSource, useDrag } from 'react-dnd'
import { DockContext, ITabs } from '..'
import { BoxAction } from '../reducer'
import { IView } from '../types'

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
  dragTabsRef: ConnectDragSource
  onClose: () => void
}

export interface FooterProps {
  tabs: ITabs
  active: number
  dragTabsRef: ConnectDragSource
  onActivate: (i: number) => void
}

export interface TabProps {
  view: IView
  active: boolean
  onActivate: () => void
  onClose: () => void
}

/**
 * Must be passed as ref to the component which should be dragged to move a view.
 */
export function dragTab(view: IView): ConnectDragSource {
  const { dispatch, state } = useContext(DockContext)
  const [{}, drag] = useDrag(
    () => ({
      type: 'VIEW',
      item: () => view,
      collect: monitor => ({ isDragging: monitor.isDragging() }),
      end: (_item, monitor) => {
        if (monitor.didDrop()) {
          dispatch(monitor.getDropResult() as BoxAction, state.current)
        }
      },
    }),
    []
  )

  return drag
}

/**
 * Hook to make a tabbed view draggable. Usage:
 *     const [{ isTabsDragging }, drag] = useDragTabs(tabs, onDrop)
 *     return <div ref={drag} className="my-tabbed-view">...</div>
 */
export function useDragTabs(tabs: ITabs, onDrop: (action: BoxAction) => void) {
  return useDrag(
    () => ({
      type: 'TABS',
      item: () => tabs,
      collect: monitor => ({ isTabsDragging: monitor.isDragging() }),
      end: (_item, monitor) => {
        if (monitor.didDrop()) {
          onDrop(monitor.getDropResult() as BoxAction)
        }
      },
    }),
    []
  )
}
