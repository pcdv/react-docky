import { useCallback, useContext } from 'react'
import { DockContext, DockCtx } from './Dock.js'
import { activate, closeAll, closeView } from './actions.js'
import { BoxAction, BoxTransformType } from './reducer.js'
import { FrameProps } from './skin/index.js'
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

  const active = Math.min(tabs.active || 0, tabs.tabs.length - 1)
  const view: IView | undefined = tabs.tabs[active]

  const acceptDrop = useCallback(
    (v: IView | ITabs, action: BoxTransformType) => {
      if (v.id !== view?.id) return true
      if (action[0] === 'd' && tabs.tabs.find(x => x.id === v.id)) return false
      return true
    },
    [view, tabs]
  )

  if (!view) return null

  return (
    <FrameRenderer
      renderFrame={renderFrame}
      onActivate={i => dispatch(activate(tabs, i), state.current)}
      onCloseTab={i => dispatch(closeView(tabs.tabs[i]), state.current)}
      onCloseAll={() => dispatch(closeAll(tabs), state.current)}
      onDrop={onDrop}
      active={active}
      view={view}
      tabs={tabs}
      viewWrapper={<ViewWrapper view={view} acceptDrop={acceptDrop} box={parent} rank={rank} />}
    />
  )
}

/**
 * Calls renderFrame from a component of its own, so that the hooks of the frame do not depend on
 * whether ViewContainer returns early.
 */
const FrameRenderer = ({ renderFrame, ...props }: FrameProps & Pick<DockCtx, 'renderFrame'>) =>
  renderFrame(props)
