import SplitPane from 'react-split-pane'
import { DropZone } from './DropZone'
import { BoxAction, ViewAction } from './reducer2'
import { ViewContainer } from './ViewContainer'
import { IBox, ITabs, IView, ViewRenderer } from './types'
import './Dockable.css'
import '../css/react-splitpane.css'

interface BoxProps {
  box: IBox
  render: ViewRenderer
  onChange: (action: BoxAction | ViewAction) => void
}

export const Box = ({ box, render, onChange }: BoxProps) => {
  const horizontal = box.orientation === 'horizontal'
  if (box.first && box.second)
    return (
      <div key={box.id} className="fill" id={`box-${box.id}`}>
        <DropZone box={box} action="o1" position={horizontal ? 'top' : 'left'} />
        <DropZone box={box} action="o2" position={horizontal ? 'bottom' : 'right'} />
        <SplitPane
          split={horizontal ? 'vertical' : 'horizontal'}
          className="box"
          defaultSize="50%"
        >
          {renderAny(box.first, render, onChange, box)}
          {renderAny(box.second, render, onChange, box)}
        </SplitPane>
      </div>
    )
  return (
    <div key={box.id} className={`box ${box.orientation}`}>
      {!!box.first && renderAny(box.first, render, onChange, box)}
      {!!box.second && renderAny(box.second, render, onChange, box)}
    </div>
  )
}

export function renderAny(
  item: IBox | ITabs | IView,
  render: ViewRenderer,
  onChange: (action: BoxAction | ViewAction) => void,
  parent: IBox
): React.ReactNode {
  switch (item.type) {
    case 'box':
      return <Box box={item} render={render} onChange={onChange} />
    case 'tabs':
      return (
        <ViewContainer
          key={item.id}
          tabs={item}
          render={render}
          onChange={onChange}
          parent={parent}
        />
      )
    case 'view':
      return render(item)
  }
}
