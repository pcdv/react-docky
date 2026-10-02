import { TabProps, useDragTab } from './index.js'

/**
 * View tab/button. Click to activate corresponding view, drag to move view elsewhere.
 */
export const Tab = ({ view, active, onActivate: onClick }: TabProps) => {
  return (
    <button key={view.id} ref={useDragTab(view)} className={active ? 'active' : ''} onClick={onClick}>
      {view.label || view.id}
    </button>
  )
}
