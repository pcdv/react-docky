import React, { createContext, useEffect, useRef, useReducer, useState, MutableRefObject } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Box } from './Box.js'
import { MountedViews, ViewElements } from './MountedViews.js'
import { DockAction, reducer } from './reducer.js'
import { FrameProps } from './skin/index.js'
import { DefaultFrame } from './skin/Frame.js'
import { IBox, ViewRenderer } from './types.js'

export type DockDispatch = (action: DockAction, oldState: IBox) => void

/**
 * `reducer` accepts a wider state than a mounted Dock ever holds, so useReducer would
 * infer that wider type. Inside a Dock the state is always an IBox.
 */
const dockReducer = (state: IBox, action: DockAction): IBox => reducer(state, action)

export interface DockCtx {
  state: MutableRefObject<IBox>
  render: ViewRenderer
  renderFrame: React.FC<FrameProps>
  dispatch: DockDispatch
  /** Set when views are kept mounted */
  viewElements?: ViewElements
}

const DEFAULT_CTX = { dispatch: () => {}, render: () => {}, state: {} } as unknown as DockCtx
export const DockContext = createContext<DockCtx>(DEFAULT_CTX)

export interface DockProps {
  initialState?: IBox
  state?: IBox
  render: ViewRenderer
  renderFrame?: React.FC<FrameProps>
  onChange?: (state: IBox) => void
  /**
   * Keep every view mounted, including when it is moved to another place and when its tab is
   * not active, so that views keep their state. Each view is rendered in a portal: React events
   * from a view propagate to the parents of the Dock, not to the frame around the view.
   */
  keepViewsMounted?: boolean
}

export const Dock = ({
  initialState,
  state,
  render,
  onChange,
  renderFrame = DefaultFrame,
  keepViewsMounted = false,
}: DockProps) => {
  let child

  if (initialState)
    child = (
      <Uncontrolled
        initialState={initialState}
        render={render}
        onChange={onChange}
        renderFrame={renderFrame}
        keepViewsMounted={keepViewsMounted}
      />
    )
  else if (state && onChange)
    child = (
      <Controlled
        state={state}
        render={render}
        onChange={onChange}
        renderFrame={renderFrame}
        keepViewsMounted={keepViewsMounted}
      />
    )
  else throw Error('Must supply either state + onChange or initialState')

  return (
    <DndProvider backend={HTML5Backend}>
      {child}
    </DndProvider>
  )
}

interface UProps {
  initialState: IBox
  render: ViewRenderer
  onChange?: (state: IBox) => void
  renderFrame: React.FC<FrameProps>
  keepViewsMounted?: boolean
}

interface CProps {
  state: IBox
  render: ViewRenderer
  onChange: (state: IBox) => void
  renderFrame: React.FC<FrameProps>
  keepViewsMounted?: boolean
}

/** Provides the context of a Dock, and renders its layout */
const DockContent = ({
  layout,
  keepViewsMounted,
  ...ctx
}: Omit<DockCtx, 'viewElements'> & { layout: IBox; keepViewsMounted?: boolean }) => {
  const [elements] = useState(() => new ViewElements())
  const viewElements = keepViewsMounted ? elements : undefined
  return (
    <DockContext.Provider value={{ ...ctx, viewElements }}>
      <Box box={layout} />
      {viewElements && <MountedViews layout={layout} elements={viewElements} />}
    </DockContext.Provider>
  )
}

export const Uncontrolled = ({ initialState, onChange, ...props }: UProps) => {
  const [state, dispatch] = useReducer(dockReducer, initialState)
  const ref = useRef(state)
  useEffect(() => {
    if (state === ref.current) return
    ref.current = state
    onChange?.(state)
  }, [state, onChange])
  return <DockContent {...props} layout={state} state={ref} dispatch={dispatch} />
}

export const Controlled = ({ state, onChange, ...props }: CProps) => {
  const ref = useRef(state)
  useEffect(() => {
    ref.current = state
  }, [state])
  const dispatch = (action: DockAction) => onChange(reducer(ref.current, action))
  return <DockContent {...props} layout={state} state={ref} dispatch={dispatch} />
}
