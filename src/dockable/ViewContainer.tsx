import { ReactElement } from 'react'
import { useDrop } from 'react-dnd'
import { ViewWrapper } from './ViewWrapper'

/**
 * Provided by the user, renders a view, identified by its viewType and id.
 */
export type ViewRenderer = (view: IView) => ReactElement

export interface ITabs {
  type: 'tabs'
  tabs: IView[]
}

export interface IView {
  type: 'view'
  viewType: string
  id: string
  label: string
}

interface ViewContainerProps {
  tabs: ITabs
  render: ViewRenderer
}

export const ViewContainer = ({ tabs, render }: ViewContainerProps) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'VIEW',
    drop: () => ({ name: 'Dustbin' }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))
  if (tabs.tabs.length === 0) return null

  const isActive = canDrop && isOver
  let backgroundColor = '#fff'
  if (isActive) {
    backgroundColor = 'darkgreen'
  } else if (canDrop) {
    backgroundColor = 'darkkhaki'
  }

  return (
    <div ref={drop} style={{ backgroundColor }} className="views-container">
      <div>{tabs.tabs[0].label}</div>
      {isActive ? 'Release to drop' : null}
      <ViewWrapper view={tabs.tabs[0]} render={render} />
    </div>
  )
}
