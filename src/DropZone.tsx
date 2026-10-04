import { useDndContext, useDroppable } from '@dnd-kit/core'
import { FC } from 'react'
import { DragData, DropData } from './drag.js'
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
  const item = (useDndContext().active?.data.current as DragData | undefined)?.item
  const canDrop = !!item && (accept ? accept(item, action) : true)
  // The action depends on the orientation of the box, which can change while this zone stays
  // mounted: dnd-kit always reads the latest data
  const key = `${box.id}-${action}`
  const data: DropData = { drop: dragged => dropAction(box.id, dragged as IView, action) }
  const { setNodeRef, isOver } = useDroppable({ id: key, disabled: !canDrop, data })

  if (!item) return null
  return (
    <>
      <div ref={setNodeRef} key={key} className={`dz-trigger ${position} `} title={key} />
      {canDrop && isOver && <div className={`drop-zone ${position}`} />}
    </>
  )
}
