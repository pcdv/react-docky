import { ReactNode, useContext } from 'react'
import { DropZone } from './DropZone.js'
import { Splitter } from './Splitter.js'
import { ViewContainer } from './ViewContainer.js'
import { IBox, ITabs } from './types.js'
import { DockContext } from './Dock.js'

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
          size={box.size ?? '50%'}
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

function renderAny(rank: 1 | 2, item: IBox | ITabs, parent: IBox): ReactNode {
  switch (item.type) {
    case 'box':
      return <Box key={item.id} box={item} />
    case 'tabs':
      return <ViewContainer key={item.id + '-' + item.active} tabs={item} rank={rank} parent={parent} />
  }
}
