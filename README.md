# Simple docking layout for React

*Work in progress*

Allows rearranging the layout by dragging and resizing views.

[Demo](https://s5hib.csb.app/) - 
[Sandbox](https://codesandbox.io/s/react-docky-forked-s5hib)

Examples:
 * [Uncontrolled](https://github.com/pcdv/react-docky/blob/main/example/src/App.tsx)
 * [Controlled, with undo](https://github.com/pcdv/react-docky/blob/main/example/src/App2.tsx)

*Todo*
 * Skins / easy customization of look and feel
 * More tests and examples

*Maybe todo*
 * Maximize view?
 * Floating mode?

## Install

```
npm install react-docky
```

## Build / test

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
