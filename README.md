# Simple docking layout for React

*Work in progress*

Allows rearranging the layout by dragging and resizing views.

[Demo](https://pcdv.github.io/react-docky/)

Examples:
 * [Skins](https://github.com/pcdv/react-docky/blob/main/example/src/Skins.tsx): the same layout as a dark IDE, Windows 95, a 1-bit Macintosh or Turbo Vision
 * [Uncontrolled](https://github.com/pcdv/react-docky/blob/main/example/src/App.tsx)
 * [Controlled, with undo](https://github.com/pcdv/react-docky/blob/main/example/src/App2.tsx)
 * [Custom look and feel](https://github.com/pcdv/react-docky/blob/main/example/src/Custom.tsx)

## Features
 * Unlimited nesting of views
 * Resizable views (double-click a resizer to split evenly). The `Splitter` component used for
   that is exported, and can split any content in two, with a size in any CSS unit
 * Tabbed views (drag all views or single tab)
 * Customizable look and feel: give `renderFrame` your own component, built with the skin API
   (`FrameProps`, `useDragTab`, `useDragTabs`)

## Gotchas
 * By default, a view is remounted, and loses its state, when it is moved to another parent or
   when its tab is hidden. With `keepViewsMounted`, every view stays mounted and is moved
   instead, but as it is rendered in a portal, the React events of a view propagate to the
   parents of the Dock rather than to the frame around the view.

## Dependencies
 * react 18 or 19
 * @dnd-kit/core, installed with react-docky: views are dragged with a mouse, or with a finger
   held for a moment on a tab or title, so that a tap still activates a tab and a swipe still
   scrolls. Each Dock has its own drag-and-drop context.

## Todo
 * More tests and examples

Maybe later
 * Maximize view?
 * Floating mode?

## How to install

```
npm install react-docky
```

And import the styles:

```ts
import 'react-docky/assets/index.css' // layout and drop zones
import 'react-docky/assets/skin.css' // default look and feel
import 'react-docky/assets/splitter.css' // resizers
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

The [demo](https://pcdv.github.io/react-docky/) is built from `main` and deployed to GitHub Pages by
[a workflow](.github/workflows/pages.yml).

## Alternatives

Similar projects with a different approach:
 * https://github.com/ticlo/rc-dock
 * https://github.com/nomcopter/react-mosaic
 * https://github.com/caplin/FlexLayout
