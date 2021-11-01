import { DropZone } from './DropZone'
import { BoxAction, BoxTransformType, ViewAction } from './reducer2'
import { Direction, IBox, ITabs, Orientation, ViewRenderer } from './types'
import { ViewWrapper } from './ViewWrapper'

interface ViewContainerProps {
  parent: IBox
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

export const ViewContainer = ({ parent, tabs, render, onChange }: ViewContainerProps) => {
  if (tabs.tabs.length === 0) return null
  const rank = parent.first?.id === tabs.id ? 1 : 2

  return (
    <div className="views-container" id={`tabs-${tabs.id}`}>
      {directions.map((position, i) => (
        <DropZone
          key={i}
          box={parent}
          position={position}
          action={transform(i, rank, parent.orientation)}
        />
      ))}
      <div>
        [{parent.id}-{tabs.id}]
        {tabs.tabs.map(t => (
          <span key={t.id}>{t.label + ' '}</span>
        ))}
      </div>
      <button
        onClick={() =>
          onChange({ type: 'kill', viewId: tabs.tabs[0].id, simplify: true })
        }
      >
        Close
      </button>
      <ViewWrapper
        key={tabs.tabs[0].id}
        view={tabs.tabs[0]}
        render={render}
        onChange={onChange}
      />
    </div>
  )
}
