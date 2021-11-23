import React, { createContext, useEffect, useRef, useReducer, MutableRefObject } from 'react'
import { Box } from './Box'
import { DockAction, reducer } from './reducer'
import { IBox, ViewRenderer } from './types'

interface DockCtx {
  state: MutableRefObject<IBox>
  render: ViewRenderer
  dispatch: (action: DockAction, oldState: IBox) => void
}

const DEFAULT_CTX = {dispatch: () => {}, render: () => {}, state: {}} as unknown as DockCtx
export const DockContext = createContext<DockCtx>(DEFAULT_CTX)

interface Props {
  initialState?: IBox
  state?: IBox
  render: ViewRenderer
  onChange?: (state: IBox) => void
}

export const Dock = ({ initialState, state, render, onChange }: Props) => {
  if (initialState)
    return <Uncontrolled initialState={initialState} render={render} onChange={onChange} />
  else if (state && onChange)
    return <Controlled state={state} render={render} onChange={onChange} />
  else throw Error('Must supply either state or initialState')
}

interface UProps {
  initialState: IBox
  render: ViewRenderer
  onChange?: (state: IBox) => void
}

interface CProps {
  state: IBox
  render: ViewRenderer
  onChange: (state: IBox) => void
}

export const Uncontrolled = ({ initialState, render, onChange }: UProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const ref = useRef(state)
  useEffect(() => {
    if (state !== initialState) onChange && onChange(ref.current)
  }, [state])
  return (
    <DockContext.Provider value={{ state: ref, render, dispatch }}>
      <Box box={state} />
    </DockContext.Provider>
  )
}
export const Controlled = ({ state, render, onChange }: CProps) => {
  const ref = useRef(state)
  useEffect(() => {
    ref.current = state
  }, [state])
  const dispatch = (action: DockAction) => onChange(reducer(ref.current, action))
  return (
    <DockContext.Provider value={{ state: ref, render, dispatch }}>
      <Box box={state} />
    </DockContext.Provider>
  )
}
