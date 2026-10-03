# Examples

From the root of the repository:

```sh
npm install
npm run dev
```

The examples get react-docky from its sources (see `vite.config.ts`), so changes to the library
are reloaded right away.

* [Skins](src/Skins.tsx): the same layout and views in several skins, each a frame component and a
  stylesheet in [skins](src/skins): a dark IDE, Windows 95, a 1-bit Macintosh and Turbo Vision.
  The skin changes without losing the layout or the state of the views.
* [Uncontrolled](src/App.tsx): the Dock keeps the layout
* [Controlled, with undo](src/App2.tsx): the application keeps the layout and its history
* [Custom look and feel](src/Custom.tsx): tabs on top, drag the bar next to the tabs to move all of them
