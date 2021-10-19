import { FC, ReactNode } from 'react'
import { useDrop } from 'react-dnd'
import { IBox } from './Box'
import { ITabs } from './ViewContainer'

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

interface DZProps {
  box: IBox | ITabs
  direction: 'left' | 'right' | 'top' | 'bottom'
}
const DropZone: FC<DZProps> = ({ box, direction }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'VIEW',
    canDrop: (item, monitor) => {
      return true
    },
    drop: () => box,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))
  const isActive = canDrop && isOver
  if (isActive) console.log('yolo')

  return (
    <div
      ref={drop}
      className={`drop-zone ${direction} ${isActive ? 'over' : ''}`}
    >
      {isActive && <div />}
    </div>
  )
}
