import { FrameProps, TabProps, useDragTab, useDragTabs } from 'react-docky'
import './ide.css'

const Tab = ({ view, active, onActivate, onClose }: TabProps) => (
  <div
    className={active ? 'ide-tab active' : 'ide-tab'}
    ref={useDragTab<HTMLDivElement>(view)}
    onClick={onActivate}
  >
    {view.label}
    <button
      className="ide-close"
      aria-label={`Close ${view.label}`}
      onClick={e => {
        e.stopPropagation()
        onClose()
      }}
    >
      ×
    </button>
  </div>
)

/**
 * Tabs on top, each with its close button. The empty part of the tab bar moves the whole group.
 * The frame gets focus when clicked, and its active tab is highlighted while it has it.
 */
export function IdeFrame(p: FrameProps) {
  const [{ isTabsDragging }, drag] = useDragTabs<HTMLDivElement>(p.tabs, p.onDrop)
  return (
    <div
      className={isTabsDragging ? 'views-container ide-frame moving' : 'views-container ide-frame'}
      tabIndex={-1}
    >
      <div className="ide-tabs" ref={drag}>
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
      {p.viewWrapper}
    </div>
  )
}
