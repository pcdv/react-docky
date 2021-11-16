import React, { useContext } from 'react'
import SplitPane from 'react-split-pane'
import { DropZone } from './DropZone'
import { BoxAction, ViewAction } from './reducer2'
import { ViewContainer } from './ViewContainer'
import { IBox, ITabs, ViewRenderer } from './types'
import { DockContext } from './Dock'

interface BoxProps {
  box: IBox
}

export const Box = ({ box }: BoxProps) => {
  const { render, dispatch} = useContext(DockContext)
  const horizontal = box.orientation === 'horizontal'
  if (box.one && box.two)
    return (
      <div key={box.id} className="" id={`box-${box.id}`}>
        <DropZone box={box} action="o1" position={horizontal ? 'top' : 'left'} />
        <DropZone box={box} action="o2" position={horizontal ? 'bottom' : 'right'} />
        <SplitPane split={horizontal ? 'vertical' : 'horizontal'} className="box" defaultSize="50%">
          {renderAny(1, box.one, render, dispatch, box)}
          {renderAny(2, box.two, render, dispatch, box)}
        </SplitPane>
      </div>
    )
  return (
    <div key={box.id} className={`box ${box.orientation}`}>
      {!!box.one && renderAny(1, box.one, render, dispatch, box)}
      {!!box.two && renderAny(2, box.two, render, dispatch, box)}
    </div>
  )
}

function renderAny(
  rank: 1 | 2,
  item: IBox | ITabs,
  render: ViewRenderer,
  dispatch: (action: BoxAction | ViewAction) => void,
  parent: IBox
): React.ReactNode {
  switch (item.type) {
    case 'box':
      return <Box key={item.id} box={item} />
    case 'tabs':
      return (
        <ViewContainer
          key={item.id}
          tabs={item}
          rank={rank}
          render={render}
          dispatch={dispatch}
          parent={parent}
        />
      )
  }
}
