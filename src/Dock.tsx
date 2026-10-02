import React, { createContext, useEffect, useRef, useReducer, MutableRefObject } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Box } from './Box.js'
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

interface DockCtx {
  state: MutableRefObject<IBox>
  render: ViewRenderer
  renderFrame: React.FC<FrameProps>
  dispatch: DockDispatch
}

const DEFAULT_CTX = { dispatch: () => {}, render: () => {}, state: {} } as unknown as DockCtx
export const DockContext = createContext<DockCtx>(DEFAULT_CTX)

export interface DockProps {
  initialState?: IBox
  state?: IBox
  render: ViewRenderer
  renderFrame?: React.FC<FrameProps>
  onChange?: (state: IBox) => void
}

export const Dock = ({
  initialState,
  state,
  render,
  onChange,
  renderFrame = DefaultFrame,
}: DockProps) => {
  let child

  if (initialState)
    child = (
      <Uncontrolled
        initialState={initialState}
        render={render}
        onChange={onChange}
        renderFrame={renderFrame}
      />
    )
  else if (state && onChange)
    child = (
      <Controlled state={state} render={render} onChange={onChange} renderFrame={renderFrame} />
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
}

interface CProps {
  state: IBox
  render: ViewRenderer
  onChange: (state: IBox) => void
  renderFrame: React.FC<FrameProps>
}

export const Uncontrolled = ({ initialState, render, onChange, renderFrame }: UProps) => {
  const [state, dispatch] = useReducer(dockReducer, initialState)
  const ref = useRef(state)
  useEffect(() => {
    if (state === ref.current) return
    ref.current = state
    onChange?.(state)
  }, [state, onChange])
  return (
    <DockContext.Provider value={{ state: ref, render, dispatch, renderFrame }}>
      <Box box={state} />
    </DockContext.Provider>
  )
}
export const Controlled = ({ state, render, onChange, renderFrame }: CProps) => {
  const ref = useRef(state)
  useEffect(() => {
    ref.current = state
  }, [state])
  const dispatch = (action: DockAction) => onChange(reducer(ref.current, action))
  return (
    <DockContext.Provider value={{ state: ref, render, dispatch, renderFrame }}>
      <Box box={state} />
    </DockContext.Provider>
  )
}
