# react-docky

[![npm](https://img.shields.io/npm/v/react-docky)](https://www.npmjs.com/package/react-docky)
[![license](https://img.shields.io/npm/l/react-docky)](https://github.com/pcdv/react-docky/blob/main/package.json)

A small docking layout for React. Users rearrange views by dragging their tabs or title bars
onto each other, resize them with splitters, and group them in tabs, with a mouse or on a
touch screen.

**[Live demo](https://pcdv.github.io/react-docky/)**: the same layout as a dark IDE, Windows 95,
a 1-bit Macintosh and Turbo Vision.

## Features

- **Drag and drop**: drop a view on an edge of another to split the space, or on its center to
  add it as a tab. Single tabs and whole tab groups can be moved.
- **Touch support**: a short press on a tab or title bar starts a drag, so that a tap still
  activates a tab and a swipe still scrolls.
- **Unlimited nesting** of resizable splits. Double-click a resizer to split evenly.
- **Controlled or uncontrolled**: let the Dock keep the layout, or keep it in your own state
  to save it, restore it or undo changes.
- **Views that keep their state** while they are moved or hidden, with `keepViewsMounted`.
- **Skinnable**: replace the default frame with your own component, using a small skin API.
- **Reusable splitter**: the `Splitter` component splits any content in two.
- Written in TypeScript, for React 18 and 19.

## Installation

```sh
npm install react-docky
```

Then import the styles once, for instance in your entry point:

```ts
import 'react-docky/assets/index.css' // layout and drop zones (required)
import 'react-docky/assets/splitter.css' // resizers
import 'react-docky/assets/skin.css' // default look and feel, not needed with your own skin
```

## Quick start

A layout is a tree of **boxes**, each split in two (`one` and `two`) side by side
(`horizontal`) or stacked (`vertical`). The leaves are **tab groups**, which hold **views**.
The Dock renders each view with the `render` function you give it.

```tsx
import { Dock, IBox, IView } from 'react-docky'

const layout: IBox = {
  type: 'box',
  id: 'root',
  orientation: 'horizontal',
  one: {
    type: 'tabs',
    id: 'left',
    tabs: [{ type: 'view', id: 'files', viewType: 'explorer', label: 'Files' }],
  },
  two: {
    type: 'tabs',
    id: 'right',
    tabs: [
      { type: 'view', id: 'main.ts', viewType: 'editor', label: 'main.ts' },
      { type: 'view', id: 'README.md', viewType: 'editor', label: 'README.md' },
    ],
  },
}

function render(view: IView) {
  switch (view.viewType) {
    case 'explorer':
      return <FileExplorer />
    default:
      return <Editor file={view.id} />
  }
}

export const App = () => (
  // The Dock fills its parent, which needs a size
  <div style={{ height: '100vh' }}>
    <Dock initialState={layout} render={render} />
  </div>
)
```

`viewType` and `label` are yours to use: the Dock only shows `label` (or `id` if there is none)
in tabs and title bars. View ids must be unique within a layout.

## Keeping the layout in your state

Pass `state` and `onChange` instead of `initialState` to own the layout, for instance to save it
across sessions:

```tsx
import { useState } from 'react'
import { addView, Dock, IBox } from 'react-docky'

export function Workspace() {
  const [layout, setLayout] = useState<IBox>(
    () => JSON.parse(localStorage.getItem('layout') ?? 'null') ?? defaultLayout
  )

  const onChange = (newLayout: IBox) => {
    setLayout(newLayout)
    localStorage.setItem('layout', JSON.stringify(newLayout))
  }

  const openFile = (file: string) =>
    onChange(addView(layout, { type: 'view', id: file, viewType: 'editor', label: file }, 'right'))

  return (
    <>
      <button onClick={() => openFile('notes.md')}>Open notes</button>
      <Dock state={layout} onChange={onChange} render={render} />
    </>
  )
}
```

Helpers to change a layout from outside of the Dock:

| Helper | Description |
| --- | --- |
| `addView(layout, view, to?)` | Adds a view as the active tab of the tab group `to` (or of the group holding the view `to`), or next to the last view |
| `collectViews(layout)` | Lists every view of a layout, in active tabs or not |
| `reducer(layout, action)` | Applies the same actions as the Dock: drop, close, resize, activate a tab |
| `repr(layout)` | A compact text form of a layout, such as `h(a, v(b-c, d))`, handy in tests |

The [controlled example](https://github.com/pcdv/react-docky/blob/main/example/src/App2.tsx) uses `reducer` to add views and keeps a history
of layouts to undo changes.

## Keeping views mounted

By default, a view is remounted, and loses its state, when it is moved to another place or when
its tab is hidden. With `keepViewsMounted`, every view stays mounted and its element is moved
instead:

```tsx
<Dock initialState={layout} render={render} keepViewsMounted />
```

Views are then rendered in portals: their React events propagate to the parents of the Dock
rather than to the frame around them.

## Custom look and feel

`renderFrame` replaces the frame drawn around each tab group. The skin API gives it everything
it needs: `FrameProps` describes the tab group and its callbacks, `useDragTab` makes an element
drag a single view, and `useDragTabs` makes one drag the whole group.

```tsx
import { Dock, FrameProps, IView, useDragTab, useDragTabs } from 'react-docky'

const Tab = ({ view, active, onClick }: { view: IView; active: boolean; onClick: () => void }) => (
  <button ref={useDragTab<HTMLButtonElement>(view)} className={active ? 'tab active' : 'tab'} onClick={onClick}>
    {view.label ?? view.id}
  </button>
)

const Frame = (p: FrameProps) => {
  const [{ isTabsDragging }, drag] = useDragTabs<HTMLDivElement>(p.tabs, p.onDrop)
  return (
    // Keep the views-container class: the layout styles rely on it
    <div className={isTabsDragging ? 'views-container dragging' : 'views-container'}>
      <div className="tab-bar" ref={drag}>
        {p.tabs.tabs.map((view, i) => (
          <Tab key={view.id} view={view} active={i === p.active} onClick={() => p.onActivate(i)} />
        ))}
        <button onClick={p.onCloseAll}>×</button>
      </div>
      {p.viewWrapper}
    </div>
  )
}

export const App = () => <Dock initialState={layout} render={render} renderFrame={Frame} />
```

The label that follows the pointer during a drag has the class `rd-drag-preview`. The
[skins of the demo](https://github.com/pcdv/react-docky/tree/main/example/src/skins) show complete frames, with their CSS.

## Splitter

The component that splits boxes is exported, and works with any content:

```tsx
import { Splitter } from 'react-docky'

<Splitter orientation="horizontal" defaultSize="25%" onResized={size => console.log(size)}>
  <Sidebar />
  <Content />
</Splitter>
```

The size of the first pane can be given in pixels or in any CSS unit. When `defaultSize` is a
percentage, the size set by the user is kept as a percentage too, so the panes keep their
proportions when the container is resized.

## API

### `<Dock>`

| Prop | Type | Description |
| --- | --- | --- |
| `render` | `(view: IView) => ReactElement` | Renders the content of a view. Required. |
| `initialState` | `IBox` | Initial layout, which the Dock then keeps (uncontrolled). |
| `state` | `IBox` | Current layout, with `onChange` (controlled). |
| `onChange` | `(layout: IBox) => void` | Called with the new layout after each change. |
| `renderFrame` | `FC<FrameProps>` | The frame around each tab group. Defaults to `DefaultFrame`. |
| `keepViewsMounted` | `boolean` | Keeps every view mounted when it is moved or hidden. |

### `<Splitter>`

| Prop | Type | Description |
| --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | Panes side by side, or stacked. |
| `children` | `[ReactNode, ReactNode]` | The two panes. |
| `defaultSize` | `number \| string` | Size of the first pane until the user resizes it. `'50%'` by default. |
| `size` | `number \| string` | Size of the first pane, when the application keeps it. |
| `onResized` | `(size?: number) => void` | Called after a resize with the size in pixels, or `undefined` after a double-click. |
| `className` | `string` | Classes added to the container. |

## Examples

- [Skins](https://github.com/pcdv/react-docky/blob/main/example/src/Skins.tsx): one layout, four complete looks
- [Uncontrolled](https://github.com/pcdv/react-docky/blob/main/example/src/App.tsx): the simplest use
- [Controlled, with undo](https://github.com/pcdv/react-docky/blob/main/example/src/App2.tsx)
- [Custom look and feel](https://github.com/pcdv/react-docky/blob/main/example/src/Custom.tsx)

## Development

```sh
npm install
npm run dev        # the example app, which uses the sources of the library directly
npm test           # or npm run test:watch
npm run lint
npm run typecheck  # the library, its tests and the examples
npm run build      # the library, in lib/
```

The [demo](https://pcdv.github.io/react-docky/) is built from `main` and deployed to GitHub
Pages by [a workflow](https://github.com/pcdv/react-docky/blob/main/.github/workflows/pages.yml).

## Alternatives

Other docking layouts for React, with a different approach:

- [rc-dock](https://github.com/ticlo/rc-dock)
- [react-mosaic](https://github.com/nomcopter/react-mosaic)
- [FlexLayout](https://github.com/caplin/FlexLayout)

## License

MIT
