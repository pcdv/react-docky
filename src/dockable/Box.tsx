import SplitPane from 'react-split-pane'
import { ITabs, ViewRenderer } from './ViewContainer'
import { renderAny } from "./renderAny"

export interface IBox {
  type: 'box'
  orientation: 'vertical' | 'horizontal'
  first: IBox | ITabs
  second?: IBox | ITabs | null
}

interface BoxProps {
  state: IBox
  render: ViewRenderer
}

export const Box = ({ state: box, render }: BoxProps) => {
  if (box.first && box.second)
    return (
      <SplitPane
        split={box.orientation === 'vertical' ? 'horizontal' : 'vertical'}
        className={`box`}
        defaultSize="50%"
      >
        {renderAny(box.first, render)}
        {renderAny(box.second, render)}
      </SplitPane>
    )
  return (
    <div className={`box ${box.orientation}`}>
      {!!box.first && renderAny(box.first, render)}
      {!!box.second && renderAny(box.second, render)}
    </div>
  )
}
