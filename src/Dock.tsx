import React, { createContext } from 'react'
import { Box } from './Box'
import { BoxAction, ViewAction } from './reducer2'
import { IBox, IView, ViewRenderer } from './types'

interface DockProps extends DockCtx {
  state: IBox
}

interface DockCtx {
  render: ViewRenderer
  dispatch: (action: BoxAction | ViewAction) => void
}

export const DockContext = createContext<DockCtx>({
  render: (_v: IView) => <div/>,
  dispatch: _action => {},
})

export const Dock = ({ state, render, dispatch }: DockProps) => {
  return (
    <DockContext.Provider value={{ render, dispatch }}>
      <Box box={state} />
    </DockContext.Provider>
  )
}
