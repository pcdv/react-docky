import { RefCallback, useCallback } from 'react'
import type { ConnectDragSource, ConnectDropTarget } from 'react-dnd'

/** A react-dnd connector, which can be attached to a DOM node. */
export type DndConnector = ConnectDragSource | ConnectDropTarget

/**
 * Adapts a react-dnd connector into a ref callback.
 *
 * Connectors return the connected element, which React 19 refuses in a callback ref:
 * anything a ref callback returns is treated as a cleanup function. The returned
 * callback discards it, and keeps a stable identity so the connector is not detached
 * and reattached on every render.
 */
export const useDndRef = <T extends HTMLElement>(connect: DndConnector): RefCallback<T> =>
  useCallback<RefCallback<T>>(
    node => {
      connect(node)
    },
    [connect]
  )
