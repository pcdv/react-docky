# Simple docking layout for React

*Work in progress*

Allows rearranging the layout by dragging and resizing views.

[Demo](https://s5hib.csb.app/)
[Sandbox](https://codesandbox.io/s/react-docky-forked-s5hib)

Examples:
 * [Uncontrolled](https://github.com/pcdv/react-docky/blob/main/example/src/App.tsx)
 * [Controlled, with undo](https://github.com/pcdv/react-docky/blob/main/example/src/App2.tsx)
 * [Custom look and feel](https://github.com/pcdv/react-docky/blob/main/example/src/Custom.tsx)

## Features
 * Unlimited nesting of views
 * Resizable views (double-click a resizer to split evenly)
 * Tabbed views (drag all views or single tab)
 * Customizable look and feel: give `renderFrame` your own component, built with the skin API
   (`FrameProps`, `useDragTab`, `useDragTabs`)

## Gotchas
 * When a view is moved to another parent, it loses its state (not sure whether this will
   be fixed, in the meantime the solution is to store the state outside of the view)

## Dependencies
 * react 18 or 19
 * react-dnd 16 and react-dnd-html5-backend: the Dock provides a DndProvider with the HTML5
   backend, unless the application already has one

## Todo
 * More tests and examples

Maybe later
 * Maximize view?
 * Floating mode?

## How to install

```
npm install react-docky react-dnd react-dnd-html5-backend
```

And import the styles:

```ts
import 'react-docky/assets/index.css' // layout and drop zones
import 'react-docky/assets/skin.css' // default look and feel
import 'react-docky/assets/react-splitpane.css' // resizers
```

## How to build / test

```sh
npm install
npm run build      # the library, in lib/
npm test           # or npm run test:watch
npm run lint
npm run typecheck  # the library, its tests and the examples
```

To try changes in the [example app](example), which uses the sources of the library directly:

```sh
npm run dev
```

## Alternatives

Similar projects with a different approach:
 * https://github.com/ticlo/rc-dock
 * https://github.com/nomcopter/react-mosaic
 * https://github.com/caplin/FlexLayout
