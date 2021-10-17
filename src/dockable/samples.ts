import { IBox } from './Box'

export const sample: IBox = {
  id: 'box0',
  type: 'box',
  orientation: 'vertical',

  first: {
    id: 'box1',
    type: 'box',
    orientation: 'horizontal',

    first: {
      id: 'tabs1',
      type: 'tabs',
      tabs: [{ type: 'view', id: 'red', label: 'Red', viewType: 'colored' }],
    },

    second: {
      type: 'box',
      id: 'box2',
      orientation: 'vertical',

      first: {
        id: 'tabs2',
        type: 'tabs',
        tabs: [
          { type: 'view', id: 'green', label: 'Green', viewType: 'colored' },
        ],
      },

      second: {
        id: 'tabs3',
        type: 'tabs',
        tabs: [
          { type: 'view', id: 'orange', label: 'Orange', viewType: 'colored' },
        ],
      },
    },
  },
  second: {
    id: 'tabs4',
    type: 'tabs',
    tabs: [{ type: 'view', id: 'blue', label: 'Blue', viewType: 'colored' }],
  },
}
