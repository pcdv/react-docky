import { FC } from 'react'
import { useDrop } from 'react-dnd'
import { BoxAction, BoxTransformType } from './reducer2'
import { Direction, IBox, IView } from './types'

/**
 * Action generated when a view is dropped on a drop zone.
 */
function dropAction(boxId: string, view: IView, type: BoxTransformType): BoxAction {
  return {
    type,
    boxId,
    view,
  }
}
interface DZProps {
  box: IBox
  position: Direction
  action: BoxTransformType
  accept?: (view: IView) => boolean
}

export const DropZone: FC<DZProps> = ({ box, position, action, accept }) => {
  const [{ canDrop, isOver, isVisible }, drop] = useDrop(() => ({
    accept: 'VIEW',
    canDrop: (item, monitor) => {
      return accept ? accept(item as IView) : true
    },
    drop: item => {
      console.log('drop on '+box.id)
      return dropAction(box.id, item as IView, action)
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      isVisible: !!monitor.getItem(),
    }),
  }))
  const isActive = canDrop && isOver
  if (!isVisible) return null
  const key = `${box.id}-${action}`
  return (
    <>
      <div ref={drop} key={key} className={`dz-trigger ${position} `} title={key} />
      {isActive && <div className={`drop-zone ${position}`} />}
    </>
  )
}
