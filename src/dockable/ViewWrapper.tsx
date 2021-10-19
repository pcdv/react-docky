import { FC } from 'react'
import { useDrag } from 'react-dnd'
import { Action } from './reducer'
import { ITabs, IView, ViewRenderer } from './ViewContainer'

interface ViewWrapperProps {
  view: IView
  render: ViewRenderer
  onChange: (action: Action) => void
}

export const ViewWrapper: FC<ViewWrapperProps> = ({
  view,
  render,
  onChange,
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'VIEW',
      item: () => ({ id: view.id }),
      collect: monitor => ({ isDragging: monitor.isDragging() }),
      end: (item, monitor) => {
        if (monitor.didDrop()) {
          const target = monitor.getDropResult() as ITabs
          onChange({
            type: 'move-to-tab',
            containerId: target.id,
            viewId: item.id,
          })
        }
      },
    }),
    []
  )

  if (isDragging) {
    return <div ref={drag} />
  }

  // without key=... react-dnd sometimes uses the wrong view when dragging :/
  return (
    <div key={view.id} ref={drag} style={{}} className="fill">
      {render(view)}
    </div>
  )
}
