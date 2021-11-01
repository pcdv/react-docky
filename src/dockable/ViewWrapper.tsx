import { FC } from 'react'
import { useDrag } from 'react-dnd'
import { BoxAction, ViewAction } from './reducer2'
import { IView, ViewRenderer } from './types'
interface ViewWrapperProps {
  view: IView
  render: ViewRenderer
  onChange: (action: BoxAction | ViewAction) => void
}

export const ViewWrapper: FC<ViewWrapperProps> = ({
  view,
  render,
  onChange,
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'VIEW',
      item: () => view,
      collect: monitor => ({ isDragging: monitor.isDragging() }),
      end: (item, monitor) => {
        if (monitor.didDrop()) {
          onChange({ type: 'kill', viewId: view.id })
          onChange(monitor.getDropResult() as BoxAction)
        }
      },
    }),
    []
  )

  // without key=... react-dnd sometimes uses the wrong view when dragging :/
  return (
    <div key={view.id} ref={drag} className="">
      {render(view)}
    </div>
  )
}
