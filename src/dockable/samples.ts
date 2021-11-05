import { IBox } from './types'

export const sample: IBox = {
  id: 'box0',
  type: 'box',
  orientation: 'vertical',

  one: {
    id: 'tabs1',
    type: 'tabs',
    tabs: [{ type: 'view', id: 'red', label: 'Red', viewType: 'colored' }],
  },
  two: {
    id: 'tabs3',
    type: 'tabs',
    tabs: [{ type: 'view', id: 'orange', label: 'Orange', viewType: 'colored' }],
  },
}

export const sample2: IBox = {
  id: 'box0',
  type: 'box',
  orientation: 'vertical',

  one: {
    id: 'box1',
    type: 'box',
    orientation: 'horizontal',

    one: {
      id: 'tabs1',
      type: 'tabs',
      tabs: [{ type: 'view', id: 'red', label: 'Red', viewType: 'colored' }],
    },

    two: {
      type: 'box',
      id: 'box2',
      orientation: 'vertical',

      one: {
        id: 'tabs2',
        type: 'tabs',
        tabs: [{ type: 'view', id: 'green', label: 'Green', viewType: 'colored' }],
      },

      two: {
        id: 'tabs3',
        type: 'tabs',
        tabs: [{ type: 'view', id: 'orange', label: 'Orange', viewType: 'colored' }],
      },
    },
  },
  two: {
    id: 'tabs4',
    type: 'tabs',
    tabs: [{ type: 'view', id: 'blue', label: 'Blue', viewType: 'colored' }],
  },
}
