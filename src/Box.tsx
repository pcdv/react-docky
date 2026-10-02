import React, { useContext } from 'react'
import { DropZone } from './DropZone'
import { Splitter } from './Splitter'
import { ViewContainer } from './ViewContainer'
import { IBox, ITabs } from './types'
import { DockContext } from '.'

interface BoxProps {
  box: IBox
}

export const Box = ({ box }: BoxProps) => {
  const horizontal = box.orientation === 'horizontal'
  const { dispatch, state } = useContext(DockContext)
  if (box.one && box.two)
    return (
      <div key={box.id} className="box" id={`box-${box.id}`}>
        <DropZone box={box} action="o1" position={horizontal ? 'top' : 'left'} />
        <DropZone box={box} action="o2" position={horizontal ? 'bottom' : 'right'} />
        <Splitter
          orientation={box.orientation}
          size={box.size}
          onResized={size => dispatch({ actionType: 'resize', boxId: box.id, size }, state.current)}
        >
          {renderAny(1, box.one, box)}
          {renderAny(2, box.two, box)}
        </Splitter>
      </div>
    )
  return (
    <div key={box.id} className={`box ${box.orientation}`}>
      {!!box.one && renderAny(1, box.one, box)}
      {!!box.two && renderAny(2, box.two, box)}
    </div>
  )
}

function renderAny(rank: 1 | 2, item: IBox | ITabs, parent: IBox): React.ReactNode {
  switch (item.type) {
    case 'box':
      return <Box key={item.id} box={item} />
    case 'tabs':
      return <ViewContainer key={item.id + '-' + item.active} tabs={item} rank={rank} parent={parent} />
  }
}
