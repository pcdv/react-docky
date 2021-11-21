# Simple docking layout for React

*Work in progress*

Allows rearranging the layout by dragging and resizing views.

Sandbox: https://codesandbox.io/s/react-docky-forked-s5hib

Examples:
 * [Uncontrolled](https://github.com/pcdv/react-docky/blob/main/example/src/App.tsx)
 * [Controlled, with undo](https://github.com/pcdv/react-docky/blob/main/example/src/App2.tsx)

*Todo*
 * Stack views on top of each other (tabbed view)
 * Drag group of views / single view
 * Skins / easy customization of look and feel
 * More tests and examples

*Maybe todo*
 * Maximize view?
 * Floating mode?

## Install

```
npm install react-docky
```

## Build

```
rm -rf lib
npm install
npm build
```

To test changes in an example app
```
# in one terminal
npm watch

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
