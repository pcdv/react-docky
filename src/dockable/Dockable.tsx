import { Box } from './Box'
import { IBox, ViewRenderer } from './types'
import { BoxAction, ViewAction } from './reducer2'

interface Props {
  state: IBox
  render: ViewRenderer
  onChange: (action: BoxAction | ViewAction) => void
}

export const Dockable = ({ state, render, onChange }: Props) => {
  return <Box box={state} render={render} onChange={onChange} />
}
