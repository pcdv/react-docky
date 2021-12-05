import React, { useContext } from 'react'
import { DockContext, IView } from '.'
import { DropZone } from './DropZone'
import { BoxTransformType } from './reducer'
import { Direction, IBox, ITabs, Orientation } from './types'

interface ViewWrapperProps {
  view: IView
  box: IBox
  acceptDrop: (v: IView | ITabs, action: BoxTransformType) => boolean
  rank: 1 | 2
}

/**
 * Renders a view with drop zones over it.
 */
export const ViewWrapper = ({ view, box, acceptDrop, rank }: ViewWrapperProps) => {
  return (
    <div key={view.id} className="view-wrapper">
      {DIR.map((position, index) => (
        <DropZone
          key={box.id + '-' + view.id + '-' + index}
          box={box}
          accept={acceptDrop}
          position={position}
          action={transform(index, rank, box.orientation)}
        />
      ))}
      {useContext(DockContext).render(view)}
    </div>
  )
}

const DIR: Direction[] = ['left', 'right', 'top', 'bottom', 'over']

const TRANSFORM: Record<Orientation, string> = {
  horizontal: 'aixyd',
  vertical: 'xyaid',
}

/**
 * Return the correct transform type according to direction, box orientation and
 * rank of container in box.
 */
export function transform(index: number, rank: 1 | 2, orientation: Orientation): BoxTransformType {
  return (TRANSFORM[orientation][index] + rank) as BoxTransformType
}
