import { FrameProps, TabProps, useDragTab, useDragTabs } from 'react-docky'
import './win95.css'

const Tab = ({ view, active, onActivate }: TabProps) => (
  <button
    className={active ? 'w95-tab active' : 'w95-tab'}
    ref={useDragTab(view)}
    onClick={onActivate}
  >
    {view.label}
  </button>
)

/**
 * A window: its title bar moves the whole group, and a property sheet shows the tabs when there
 * are several. The window gets focus when clicked, and its title bar is blue while it has it.
 */
export function Win95Frame(p: FrameProps) {
  const [{ isTabsDragging }, drag] = useDragTabs<HTMLDivElement>(p.tabs, p.onDrop)
  const count = p.tabs.tabs.length
  return (
    <div
      className={
        isTabsDragging ? 'views-container w95-window moving' : 'views-container w95-window'
      }
      tabIndex={-1}
    >
      <div className="w95-title" ref={drag}>
        <span className="w95-icon" />
        <span className="w95-title-text">{p.view.label}</span>
        <button className="w95-button" aria-label="Close" onClick={p.onCloseAll}>
          ×
        </button>
      </div>
      {count > 1 && (
        <div className="w95-tabs">
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
      {p.viewWrapper}
      <div className="w95-status">
        <span>
          {count} object{count > 1 ? 's' : ''}
        </span>
        <span>{p.view.viewType}</span>
      </div>
    </div>
  )
}
