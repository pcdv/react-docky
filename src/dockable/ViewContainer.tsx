import { ReactElement } from 'react'
import { useDrop } from 'react-dnd'
import { Action } from './reducer'
import { ViewWrapper } from './ViewWrapper'

/**
 * Provided by the user, renders a view, identified by its viewType and id.
 */
export type ViewRenderer = (view: IView) => ReactElement

export interface ITabs {
  id: string
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
  onChange: (action: Action) => void
}

export const ViewContainer = ({
  tabs,
  render,
  onChange,
}: ViewContainerProps) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'VIEW',
    canDrop: (item, monitor) =>
      !tabs.tabs.find(t => t.id === (item as IView).id),
    drop: () => tabs,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))
  if (tabs.tabs.length === 0) return null

  const isActive = canDrop && isOver

  const className = isActive ? 'views-container dnd-active' : 'views-container'
  return (
    <div ref={drop} className={className}>
      <div>
        [{tabs.id}]
        {tabs.tabs.map(t => (
          <span key={t.id}>{t.label + ' '}</span>
        ))}
      </div>
      <ViewWrapper
        key={tabs.tabs[0].id}
        view={tabs.tabs[0]}
        render={render}
        onChange={onChange}
      />
    </div>
  )
}
