import React from 'react'
import SplitPane from 'react-split-pane'
import { DropZone } from './DropZone'
import { BoxAction, ViewAction } from './reducer2'
import { ViewContainer } from './ViewContainer'
import { IBox, ITabs, ViewRenderer } from './types'

interface BoxProps {
  box: IBox
  render: ViewRenderer
  onChange: (action: BoxAction | ViewAction) => void
}

export const Box = ({ box, render, onChange }: BoxProps) => {
  const horizontal = box.orientation === 'horizontal'
  if (box.one && box.two)
    return (
      <div key={box.id} className="" id={`box-${box.id}`}>
        <DropZone box={box} action="o1" position={horizontal ? 'top' : 'left'} />
        <DropZone box={box} action="o2" position={horizontal ? 'bottom' : 'right'} />
        <SplitPane split={horizontal ? 'vertical' : 'horizontal'} className="box" defaultSize="50%">
          {renderAny(1, box.one, render, onChange, box)}
          {renderAny(2, box.two, render, onChange, box)}
        </SplitPane>
      </div>
    )
  return (
    <div key={box.id} className={`box ${box.orientation}`}>
      {!!box.one && renderAny(1, box.one, render, onChange, box)}
      {!!box.two && renderAny(2, box.two, render, onChange, box)}
    </div>
  )
}

function renderAny(
  rank: 1 | 2,
  item: IBox | ITabs,
  render: ViewRenderer,
  onChange: (action: BoxAction | ViewAction) => void,
  parent: IBox
): React.ReactNode {
  switch (item.type) {
    case 'box':
      return <Box key={item.id} box={item} render={render} onChange={onChange} />
    case 'tabs':
      return (
        <ViewContainer
          key={item.id}
          tabs={item}
          rank={rank}
          render={render}
          onChange={onChange}
          parent={parent}
        />
      )
  }
}
