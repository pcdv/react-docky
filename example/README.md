# Examples

From the root of the repository:

```sh
npm install
npm run dev
```

The examples get react-docky from its sources (see `vite.config.ts`), so changes to the library
are reloaded right away.

* [Uncontrolled](src/App.tsx): the Dock keeps the layout
* [Controlled, with undo](src/App2.tsx): the application keeps the layout and its history
* [Custom look and feel](src/Custom.tsx): tabs on top, drag the bar next to the tabs to move all of them
