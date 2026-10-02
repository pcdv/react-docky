import { useCallback, useContext } from 'react'
import { DockContext } from './Dock.js'
import { activate, closeAll, closeView } from './actions.js'
import { BoxAction, BoxTransformType } from './reducer.js'
import { IBox, ITabs, IView } from './types.js'
import { ViewWrapper } from './ViewWrapper.js'

interface ViewContainerProps {
  parent: IBox
  rank: 1 | 2
  tabs: ITabs
}

export const ViewContainer = ({ parent, rank, tabs }: ViewContainerProps) => {
  const { dispatch, state, renderFrame } = useContext(DockContext)
  const onDrop = (action: BoxAction) => dispatch(action, state.current)

  if (tabs.tabs.length === 0) return null

  const _activeIndex = tabs.active || 0
  const active = _activeIndex >= tabs.tabs.length ? tabs.tabs.length - 1 : _activeIndex
  const view = tabs.tabs[active] || tabs.tabs[0]

  const acceptDrop = useCallback(
    (v: IView | ITabs, action: BoxTransformType) => {
      if (v.id !== view.id) return true
      if (action[0] === 'd' && tabs.tabs.find(x => x.id === v.id)) return false
      return true
    },
    [view]
  )

  return renderFrame({
    onActivate: i => dispatch(activate(tabs, i), state.current),
    onCloseTab: i => dispatch(closeView(tabs.tabs[i]), state.current),
    onCloseAll: () => dispatch(closeAll(tabs), state.current),
    onDrop,
    active,
    view,
    tabs,
    viewWrapper: <ViewWrapper view={view} acceptDrop={acceptDrop} box={parent} rank={rank} />,
  })
}
