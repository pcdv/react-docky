import SplitPane from 'react-split-pane'
import { ITabs, ViewRenderer } from './ViewContainer'
import { renderAny } from './renderAny'
import { Action } from './reducer'
import { DropZones } from './DropZones'

export interface IBox {
  type: 'box'
  id: string
  orientation: 'vertical' | 'horizontal'
  first?: IBox | ITabs
  second?: IBox | ITabs | null
}

interface BoxProps {
  box: IBox
  render: ViewRenderer
  onChange: (action: Action) => void
}

export const Box = ({ box, render, onChange }: BoxProps) => (
  <DropZones box={box}>
    <Box0 box={box} render={render} onChange={onChange} />
  </DropZones>
)

const Box0 = ({ box, render, onChange }: BoxProps) => {
  if (box.first && box.second)
    return (
      <SplitPane
        split={box.orientation === 'vertical' ? 'horizontal' : 'vertical'}
        className={`box`}
        defaultSize="50%"
      >
        {renderAny(box.first, render, onChange)}
        {renderAny(box.second, render, onChange)}
      </SplitPane>
    )
  return (
    <div className={`box ${box.orientation}`}>
      {!!box.first && renderAny(box.first, render, onChange)}
      {!!box.second && renderAny(box.second, render, onChange)}
    </div>
  )
}
