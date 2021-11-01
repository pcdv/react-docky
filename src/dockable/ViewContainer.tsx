import { DropZone } from './DropZones'
import { BoxAction, BoxTransformType, ViewAction } from './reducer2'
import { Direction, IBox, ITabs, ViewRenderer } from './types'
import { ViewWrapper } from './ViewWrapper'

interface ViewContainerProps {
  parent: IBox
  tabs: ITabs
  render: ViewRenderer
  onChange: (action: BoxAction | ViewAction) => void
}

function toTransform(box: IBox, tabsId: string, position: Direction): BoxTransformType {
  const pos = box.first?.id === tabsId ? '1' : '2'
  let action = ''
  if (box.orientation === 'horizontal') {
    switch (position) {
      case 'left':
        action = pos === '1' ? 'a' : 'i'
        break
      case 'right':
        action = pos === '2' ? 'a' : 'i'
        break
      case 'top':
        action = 'x'
        break
      case 'bottom':
        action = 'y'
        break
    }
  } else {
    switch (position) {
      case 'left':
        action = 'x'
        break
      case 'right':
        action = 'y'
        break
      case 'top':
        action = pos === '1' ? 'a' : 'i'
        break
      case 'bottom':
        action = pos === '2' ? 'a' : 'i'
        break
    }
  }
  return (action + pos) as BoxTransformType
}

export const ViewContainer = ({
  parent,
  tabs,
  render,
  onChange,
}: ViewContainerProps) => {
  if (tabs.tabs.length === 0) return null

  const className = 'views-container'
  return (
    <div className={className} id={`tabs-${tabs.id}`}>
      <DropZone box={parent} position='left' action={toTransform(parent, tabs.id, 'left')} />
      <DropZone box={parent} position='right' action={toTransform(parent, tabs.id, 'right')} />
      <DropZone box={parent} position='top' action={toTransform(parent, tabs.id, 'top')} />
      <DropZone box={parent} position='bottom' action={toTransform(parent, tabs.id, 'bottom')} />
      <div>
        [{parent.id}-{tabs.id}]
        {tabs.tabs.map(t => (
          <span key={t.id}>{t.label + ' '}</span>
        ))}
      </div>
      <button style={{zIndex: 100000, float: 'right'}} onClick={() => onChange({type: 'kill', viewId: tabs.tabs[0].id, simplify: true})}>Close</button>
      <ViewWrapper
        key={tabs.tabs[0].id}
        view={tabs.tabs[0]}
        render={render}
        onChange={onChange}
      />
    </div>
  )
}
