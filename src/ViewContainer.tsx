import React, { useContext } from 'react'
import { CSSProperties, useState } from 'react'
import { useDrag } from 'react-dnd'
import { DockContext } from '.'
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
  const [index, setIndex] = useState(tabs.active || 0)
  const view = tabs.tabs[index] || tabs.tabs[0]
  const [{ isDragging }, drag] = useDrag(
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

  if (tabs.tabs.length === 0) return null

  return (
    <div
      className="views-container"
      id={`tabs-${tabs.id}`}
      style={isDragging ? INVISIBLE : undefined}
    >
      <div className="rd-frame-header" ref={drag}>
        <div>{view.label || view.id}</div>

        <button
          onClick={() =>
            dispatch({ type: 'kill', viewId: tabs.tabs[index].id, simplify: true }, state.current)
          }
        >
          {'\u2573'}
        </button>
      </div>

      <div key={view.id} className="view-wrapper">
        {DIR.map((position, i) => (
          <DropZone
            key={tabs.id + '-' + i}
            box={parent}
            accept={v => v.id !== view.id}
            position={position}
            action={transform(i, rank, parent.orientation)}
          />
        ))}
        {render(view)}
      </div>

      {tabs.tabs.length > 1 && (
        <div className="rd-frame-footer">
          {tabs.tabs.map((t, i) => (
            <button
              key={t.id}
              className={` ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
            >
              {t.label + ' '}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
