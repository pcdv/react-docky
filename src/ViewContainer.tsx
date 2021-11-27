import React, { useCallback, useContext } from 'react'
import { CSSProperties } from 'react'
import { useDrag } from 'react-dnd'
import { DockContext, IView } from '.'
import { DropZone } from './DropZone'
import { BoxAction, BoxTransformType } from './reducer'
import { Direction, IBox, ITabs, Orientation } from './types'

interface ViewContainerProps {
  parent: IBox
  rank: 1 | 2
  tabs: ITabs
}

const DIR: Direction[] = ['left', 'right', 'top', 'bottom', 'over']
const TRANSFORM: Record<Orientation, string> = {
  horizontal: 'aixyd',
  vertical: 'xyaid',
}

/**
 * Return the correct transform type according to direction, box orientation and
 * rank of container in box.
 */
export function transform(index: number, rank: 1 | 2, orientation: Orientation): BoxTransformType {
  return (TRANSFORM[orientation][index] + rank) as BoxTransformType
}

const INVISIBLE: CSSProperties = { display: 'none' }

export const ViewContainer = ({ parent, rank, tabs }: ViewContainerProps) => {
  const { render, dispatch, state } = useContext(DockContext)
  const index = tabs.active || 0
  const idx = index >= tabs.tabs.length ? tabs.tabs.length - 1 : index
  const view = tabs.tabs[idx] || tabs.tabs[0]

  const [{ isTabsDragging }, dragTabs] = useDrag(
    () => ({
      type: 'TABS',
      item: () => tabs,
      collect: monitor => ({ isTabsDragging: monitor.isDragging() }),
      end: (_item, monitor) => {
        if (monitor.didDrop()) {
          dispatch(monitor.getDropResult() as BoxAction, state.current)
        }
      },
    }),
    []
  )

  if (tabs.tabs.length === 0) return null

  const accept = useCallback(
    (v: IView | ITabs, action: BoxTransformType) => {
      if (v.id !== view.id) return true
      if (action[0] === 'd' && tabs.tabs.find(x => x.id === v.id)) return false
      return false
    },
    [view]
  )

  return (
    <div
      className="views-container"
      id={`tabs-${tabs.id}`}
      style={isTabsDragging ? INVISIBLE : undefined}
    >
      <Header
        view={view}
        drag={dragTabs}
        onClose={() =>
          dispatch(
            { actionType: 'kill', viewType: 'tabs', viewId: tabs.id, simplify: true },
            state.current
          )
        }
      />

      <div key={view.id} className="view-wrapper">
        {DIR.map((position, i) => (
          <DropZone
            key={tabs.id + '-' + tabs.active + '-' + i}
            box={parent}
            accept={accept}
            position={position}
            action={transform(i, rank, parent.orientation)}
          />
        ))}
        {render(view)}
      </div>

      {tabs.tabs.length > 1 && (
        <Footer
          tabs={tabs}
          active={idx}
          onActivate={i =>
            dispatch(
              { actionType: 'tabs', type: 'activate', tabsId: tabs.id, active: i },
              state.current
            )
          }
        />
      )}
    </div>
  )
}

const Header = ({ view, drag, onClose }: { view: IView; drag: any; onClose: () => void }) => {
  return (
    <div className="rd-frame-header" ref={drag}>
      <div>{view.label || view.id}</div>
      <button onClick={onClose}>{'\u2573'}</button>
    </div>
  )
}

const Footer = ({
  tabs,
  active,
  onActivate,
}: {
  tabs: ITabs
  active: number
  onActivate: (i: number) => void
}) => {
  return (
    <div className="rd-frame-footer">
      {tabs.tabs.map((v, i) => (
        <ViewButton key={v.id} view={v} active={i === active} onClick={() => onActivate(i)} />
      ))}
    </div>
  )
}

const ViewButton = ({
  view,
  active,
  onClick,
}: {
  view: IView
  active: boolean
  onClick: () => void
}) => {
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
  return (
    <button key={view.id} ref={drag} className={` ${active ? 'active' : ''}`} onClick={onClick}>
      {view.label + ' '}
    </button>
  )
}
