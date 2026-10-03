import { FrameProps, TabProps, useDragTab, useDragTabs } from 'react-docky'
import './mac.css'

const Tab = ({ view, active, onActivate }: TabProps) => (
  <button
    className={active ? 'mac-tab active' : 'mac-tab'}
    ref={useDragTab(view)}
    onClick={onActivate}
  >
    {view.label}
  </button>
)

/**
 * A window with a close box: its title bar moves the whole group, and the tabs are at the bottom.
 * The title bar is striped while the window has focus.
 */
export function MacFrame(p: FrameProps) {
  const [{ isTabsDragging }, drag] = useDragTabs<HTMLDivElement>(p.tabs, p.onDrop)
  return (
    <div
      className={
        isTabsDragging ? 'views-container mac-window moving' : 'views-container mac-window'
      }
      tabIndex={-1}
    >
      <div className="mac-title" ref={drag}>
        <button className="mac-close" aria-label="Close" onClick={p.onCloseAll} />
        <span className="mac-title-text">{p.view.label}</span>
      </div>
      {p.viewWrapper}
      {p.tabs.tabs.length > 1 && (
        <div className="mac-tabs">
          {p.tabs.tabs.map((view, i) => (
            <Tab
              key={view.id}
              view={view}
              active={i === p.active}
              onActivate={() => p.onActivate(i)}
              onClose={() => p.onCloseTab(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
