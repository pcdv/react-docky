import { FC, ReactNode } from 'react'
import { useDrop } from 'react-dnd'
import { IBox } from './Box'
import { Action, Direction } from './reducer'
import { ITabs, IView } from './ViewContainer'

interface DZSProps {
  box: IBox | ITabs
  children: ReactNode
}
export const DropZones: FC<DZSProps> = ({ box, children }) => {
  return (
    <>
      <DropZone box={box} direction="left" />
      <DropZone box={box} direction="right" />
      <DropZone box={box} direction="top" />
      <DropZone box={box} direction="bottom" />
      {children}
    </>
  )
}

/**
 * Action generated when a view is dropped on a drop zone.
 */
function dropAction(
  containerId: string,
  direction: Direction,
  item: IView
): Action {
  return {
    type: 'move',
    direction,
    containerId,
    viewId: item.id,
  }
}
interface DZProps {
  box: IBox | ITabs
  direction: Direction
}
const DropZone: FC<DZProps> = ({ box, direction }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'VIEW',
    canDrop: (item, monitor) => {
      return true
    },
    drop: item => dropAction(box.id, direction, item as IView),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))
  const isActive = canDrop && isOver

  return (
    <>
      <div ref={drop} className={`drop-zone-trigger ${direction} `} />
      {isActive && <div className={`drop-zone ${direction}`} />}
    </>
  )
}
