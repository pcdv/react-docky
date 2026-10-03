import { FrameProps, TabProps, useDragTab, useDragTabs } from 'react-docky'
import './turbo-vision.css'

const Tab = ({ view, active, onActivate }: TabProps) => (
  <button
    className={active ? 'tv-tab active' : 'tv-tab'}
    ref={useDragTab(view)}
    onClick={onActivate}
  >
    {view.label}
  </button>
)

/**
 * A text mode window: a double frame while it has focus, with the close box and the title in its
 * top line, which moves the whole group. The tabs are in its bottom line.
 */
export function TurboVisionFrame(p: FrameProps) {
  const [{ isTabsDragging }, drag] = useDragTabs<HTMLDivElement>(p.tabs, p.onDrop)
  return (
    <div
      className={isTabsDragging ? 'views-container tv-window moving' : 'views-container tv-window'}
      tabIndex={-1}
    >
      <div className="tv-top" ref={drag}>
        <button className="tv-close" aria-label="Close" onClick={p.onCloseAll}>
          [<span>■</span>]
        </button>
        <span className="tv-title">{p.view.label}</span>
      </div>
      {p.viewWrapper}
      <div className="tv-bottom">
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
    </div>
  )
}
