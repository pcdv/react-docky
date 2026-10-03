import { ComponentType, ReactNode } from 'react'
import { Dock, FrameProps } from 'react-docky'
import { IdeFrame } from './skins/Ide'
import { MacFrame } from './skins/Mac'
import { TurboVisionFrame } from './skins/TurboVision'
import { layout, renderView } from './skins/views'
import { Win95Frame } from './skins/Win95'

interface Skin {
  title: string
  Frame: ComponentType<FrameProps>
  /** How to use the frame, shown in the "Read me" view */
  about: ReactNode
}

const SKINS: Record<string, Skin> = {
  ide: {
    title: 'Dark IDE',
    Frame: IdeFrame,
    about: (
      <p>
        Click a tab to show its view, drag it to move the view, and drag the empty part of the tab
        bar to move all the tabs.
      </p>
    ),
  },
  win95: {
    title: 'Windows 95',
    Frame: Win95Frame,
    about: (
      <p>
        Drag the title bar of a window to move it with all its tabs, or a tab to move one view.
        Click in a window to give it focus.
      </p>
    ),
  },
  mac: {
    title: 'Macintosh',
    Frame: MacFrame,
    about: (
      <p>
        Drag the title bar of a window to move it with all its views, or one of the buttons at the
        bottom to move one view. The close box closes the window.
      </p>
    ),
  },
  'turbo-vision': {
    title: 'Turbo Vision',
    Frame: TurboVisionFrame,
    about: (
      <p>
        Drag the top line of a window to move it with all its views, or a tab of the bottom line to
        move one view. <code>[■]</code> closes the window.
      </p>
    ),
  },
}

/**
 * The same layout and views in several skins. The layout and the views are kept when the skin
 * changes: only the frames are replaced.
 */
export default function Skins({ arg = '' }: { arg?: string }) {
  const name = arg in SKINS ? arg : 'ide'
  const { Frame, about } = SKINS[name]

  return (
    <>
      <nav id="actions" className="skins">
        {Object.entries(SKINS).map(([key, { title }]) => (
          <a key={key} href={`#skins/${key}`} className={key === name ? 'active' : ''}>
            {title}
          </a>
        ))}
      </nav>
      <div id="desktop" className={`skin-${name}`}>
        <Dock
          initialState={layout}
          render={view => renderView(view, about)}
          // The Dock calls renderFrame as a function, from a component of its own: an element lets
          // React replace the frame when the skin changes, instead of running the hooks of another
          // frame in its place.
          renderFrame={props => <Frame {...props} />}
          keepViewsMounted
        />
      </div>
    </>
  )
}
