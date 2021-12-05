import React, { createContext, useEffect, useRef, useReducer, MutableRefObject } from 'react'
import { Box } from './Box'
import { DockAction, reducer } from './reducer'
import { FrameProps } from './skin'
import { DefaultFrame } from './skin/Frame'
import { IBox, ViewRenderer } from './types'

export type DockDispatch = (action: DockAction, oldState: IBox) => void

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
  if (initialState)
    return (
      <Uncontrolled
        initialState={initialState}
        render={render}
        onChange={onChange}
        renderFrame={renderFrame}
      />
    )
  else if (state && onChange)
    return (
      <Controlled state={state} render={render} onChange={onChange} renderFrame={renderFrame} />
    )
  else throw Error('Must supply either state + onChange or initialState')
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
  const [state, dispatch] = useReducer(reducer, initialState)
  const ref = useRef(state)
  useEffect(() => {
    if (state !== initialState) onChange && onChange(ref.current)
  }, [state])
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
