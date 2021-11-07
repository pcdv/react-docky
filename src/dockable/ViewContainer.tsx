import { CSSProperties, useState } from 'react'
import { useDrag } from 'react-dnd'
import { DropZone } from './DropZone'
import { BoxAction, BoxTransformType, ViewAction } from './reducer2'
import { Direction, IBox, ITabs, Orientation, ViewRenderer } from './types'

interface ViewContainerProps {
  parent: IBox
  rank: 1 | 2
  tabs: ITabs
  render: ViewRenderer
  onChange: (action: BoxAction | ViewAction) => void
}

const directions: Direction[] = ['left', 'right', 'top', 'bottom']
const horizontal = ['a', 'i', 'x', 'y']

/**
 * Return the correct transform type according to direction, box orientation and
 * rank of container in box.
 *
 * @param i direction index in array
 * @param rank 1 or 2
 * @param orientation box orientation
 */
function transform(i: number, rank: 1 | 2, orientation: Orientation): BoxTransformType {
  const offset = orientation === 'horizontal' ? 0 : 2
  return (horizontal[(i + offset) % 4] + rank) as BoxTransformType
}

const INVISIBLE : CSSProperties= {display: 'none'}

export const ViewContainer = ({ parent, rank, tabs, render, onChange }: ViewContainerProps) => {
  const [index, setIndex] = useState(0)
  const view = tabs.tabs[index]
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'VIEW',
      item: () => view,
      collect: monitor => ({ isDragging: monitor.isDragging() }),
      end: (item, monitor) => {
        if (monitor.didDrop()) {
          onChange(monitor.getDropResult() as BoxAction)
        }
      },
    }),
    []
  )

  if (tabs.tabs.length === 0) return null

  return (
    <div className="views-container" id={`tabs-${tabs.id}`} style={isDragging ? INVISIBLE : undefined}>
      <div className="rd-frame-header" ref={drag}>
        {view.label || view.id}
        &nbsp;({tabs.id})
        <button
          onClick={() => onChange({ type: 'kill', viewId: tabs.tabs[index].id, simplify: true })}
        >
          {'\u2573'}
        </button>
      </div>

      <div key={view.id} className="view-wrapper">
        {directions.map((position, i) => (
          <DropZone
            key={tabs.id + i}
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
          {tabs.tabs.map(t => (
            <span key={t.id}>{t.label + ' '}</span>
          ))}
        </div>
      )}
    </div>
  )
}
