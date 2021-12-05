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
 * Resizable views
 * Tabbed views (drag all views or single tab)
 * Customizable look and feel

## Gotchas
 * When a view is moved to another parent, it loses its state (not sure whether this will
   be fixed, in the meantime the solution is to store the state outside of the view)
 * The application must be wrapped in a DndProvider (from react-dnd)

## Dependencies
 * react
 * react-dnd (and the backend of your choice)
 * react-split-pane

## Todo
 * More tests and examples

Maybe later
 * Maximize view?
 * Floating mode?

## How to install

```
npm install react-docky
npm install react-dnd
npm install react-dnd-html5-backend
```

## How to build / test

```
rm -rf lib
npm install
npm run build
```

To test changes in an example app
```
# in one terminal
npm run watch

# in another terminal
cd example
npm install
npm run dev
```

To run tests
```sh
npm test
```

## Alternatives

Similar projects with a different approach:
 * https://github.com/ticlo/rc-dock
 * https://github.com/nomcopter/react-mosaic
 * https://github.com/caplin/FlexLayout
