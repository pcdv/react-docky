import { FC } from 'react'
import { useDrop } from 'react-dnd'
import { useDndRef } from './dndRef.js'
import { BoxAction, BoxTransformType } from './reducer.js'
import { Direction, IBox, ITabs, IView } from './types.js'

/**
 * Action generated when a view is dropped on a drop zone.
 */
function dropAction(boxId: string, view: IView, type: BoxTransformType): BoxAction {
  return {
    actionType: 'box',
    type,
    boxId,
    view,
  }
}
interface DZProps {
  box: IBox
  position: Direction
  action: BoxTransformType
  accept?: (view: IView | ITabs, action: BoxTransformType) => boolean
}

export const DropZone: FC<DZProps> = ({ box, position, action, accept }) => {
  // The action depends on the orientation of the box, which can change while this zone stays
  // mounted: without dependencies, react-dnd would keep the spec of the first render.
  const boxId = box.id
  const [{ canDrop, isOver, isVisible }, drop] = useDrop(
    () => ({
      accept: ['VIEW', 'TABS'],
      canDrop: (item /*, monitor*/) => {
        return accept ? accept(item as IView | ITabs, action) : true
      },
      drop: item => dropAction(boxId, item as IView, action),
      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        isVisible: !!monitor.getItem(),
      }),
    }),
    [boxId, action, accept]
  )
  const dropRef = useDndRef<HTMLDivElement>(drop)

  const isActive = canDrop && isOver
  if (!isVisible) return null
  const key = `${box.id}-${action}`
  return (
    <>
      <div ref={dropRef} key={key} className={`dz-trigger ${position} `} title={key} />
      {isActive && <div className={`drop-zone ${position}`} />}
    </>
  )
}
