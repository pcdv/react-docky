import { ReactNode, useEffect, useState } from 'react'
import { IBox, IView } from 'react-docky'

/** The same views in every skin: only the stylesheet of the skin changes how they look */
export const layout: IBox = {
  id: 'desktop',
  type: 'box',
  orientation: 'horizontal',
  size: 220,
  one: {
    id: 'left',
    type: 'tabs',
    tabs: [{ type: 'view', id: 'files', label: 'Files', viewType: 'files' }],
  },
  two: {
    id: 'right',
    type: 'box',
    orientation: 'vertical',
    one: {
      id: 'documents',
      type: 'tabs',
      tabs: [
        { type: 'view', id: 'readme', label: 'Read me', viewType: 'readme' },
        { type: 'view', id: 'notes', label: 'Notes', viewType: 'notes' },
      ],
    },
    two: {
      id: 'bottom',
      type: 'tabs',
      tabs: [{ type: 'view', id: 'clock', label: 'Clock', viewType: 'clock' }],
    },
  },
}

const FILES = [
  'Box.tsx',
  'Dock.tsx',
  'DropZone.tsx',
  'Splitter.tsx',
  'ViewContainer.tsx',
  'reducer.ts',
  'types.ts',
]

function Files() {
  const [selected, setSelected] = useState('Dock.tsx')
  return (
    <ul className="demo-view demo-files">
      {FILES.map(file => (
        <li
          key={file}
          className={file === selected ? 'selected' : ''}
          onClick={() => setSelected(file)}
        >
          {file}
        </li>
      ))}
    </ul>
  )
}

function Notes() {
  return (
    <textarea
      className="demo-view demo-notes"
      spellCheck={false}
      defaultValue={
        'Type something here, then move this view or switch to another skin: ' +
        'views are kept mounted, so the text stays.\n'
      }
    />
  )
}

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  return (
    <div className="demo-view demo-clock">
      <div className="time">{now.toLocaleTimeString()}</div>
      <div className="date">{now.toLocaleDateString()}</div>
    </div>
  )
}

function ReadMe({ children }: { children: ReactNode }) {
  return (
    <div className="demo-view demo-readme">
      <p>
        A skin is a <code>renderFrame</code> component, which draws everything around a group of
        tabbed views, and a stylesheet. The views and the layout stay the same.
      </p>
      {children}
      <p>Drag the splitters to resize, and drop a view on the edge of another one to split it.</p>
    </div>
  )
}

export function renderView(view: IView, about: ReactNode) {
  switch (view.viewType) {
    case 'files':
      return <Files />
    case 'notes':
      return <Notes />
    case 'clock':
      return <Clock />
    default:
      return <ReadMe>{about}</ReadMe>
  }
}
