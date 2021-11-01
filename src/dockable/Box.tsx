import SplitPane from 'react-split-pane'
import { DropZone } from './DropZones'
import { BoxAction, ViewAction } from './reducer2'
import { renderAny } from './renderAny'
import { IBox, ViewRenderer } from './types'
import './Dockable.css'
import '../css/react-splitpane.css'

interface BoxProps {
  box: IBox
  render: ViewRenderer
  onChange: (action: BoxAction | ViewAction) => void
}

export const Box = ({ box, render, onChange }: BoxProps) => (
  <Box0 key={box.id} box={box} render={render} onChange={onChange} />
)

const Box0 = ({ box, render, onChange }: BoxProps) => {
  const horizontal = box.orientation === 'horizontal'
  if (box.first && box.second)
    return (
      <div className="fill" id={`box-${box.id}`}>
        <DropZone box={box} action='o1' position={horizontal ? 'top' : 'left'} />
        <DropZone box={box} action='o2' position={horizontal ? 'bottom' : 'right'} />
        <SplitPane
          split={horizontal ? 'vertical' : 'horizontal'}
          className='box'
          defaultSize="50%"
        >
          {renderAny(box.first, render, onChange, box)}
          {renderAny(box.second, render, onChange, box)}
        </SplitPane>
      </div>
    )
  return (
    <div className={`box ${box.orientation}`}>
      {!!box.first && renderAny(box.first, render, onChange, box)}
      {!!box.second && renderAny(box.second, render, onChange, box)}
    </div>
  )
}
