import { IBox, ITabs, IView } from './types';


export type ViewPath = [IView, ITabs, number, (IBox | ITabs)[]];

export function findView(state: IBox, id: string): ViewPath | undefined {
  return _findView(state, id, [state]);
}
function _findView(
  state: IBox | ITabs,
  id: string,
  path: (IBox | ITabs)[]
): ViewPath | undefined {
  if (state.type === 'tabs') {
    const index = state.tabs.findIndex(v => v.id === id);
    if (index !== -1)
      return [state.tabs[index], state, index, path];
    return undefined;
  }

  let res: ViewPath | undefined;
  if (state.first) {
    res = _findView(state.first, id, [...path, state.first]);
    if (res)
      return res;
  }

  if (state.second) {
    res = _findView(state.second, id, [...path, state.second]);
    if (res)
      return res;
  }
}

export function findContainer(
  state: IBox | ITabs,
  id: string
): ITabs | IBox | undefined {
  if (state.id === id)
    return state;

  switch (state.type) {
    case 'box':
      if (state.first) {
        const res = findContainer(state.first, id);
        if (res)
          return res;
      }
      if (state.second) {
        const res = findContainer(state.second, id);
        if (res)
          return res;
      }
      return undefined;
  }
}

let counter = 0
export function genId(prefix: string): string {
  return prefix + (counter++)
}


export function wrapView(view: IView): ITabs {
  return {
    type: 'tabs',
    id: genId('tabs'),
    tabs: [view]
  }
}

export function repr(x: IBox | ITabs | IView | null | undefined): string {
  if (!x)
    return 'null'

  switch (x.type) {
    case 'box':
      return `${x.orientation[0]}[${repr(x.first)}, ${repr(x.second)}]`
    case 'tabs':
      return x.tabs.map(v => repr(v)).join('-')
    case 'view':
      if (x.dead)
        return '$' + x.id
      return x.id
    default:
      console.log(x);
      
      return (x as any)?.type + '???'
  }
}

