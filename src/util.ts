import { IBox, ITabs, IView } from './types.js'

// Unique to this page load, so that new ids never collide with the ids of a layout saved earlier
const session = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
let counter = 0
export function genId(prefix: string): string {
  return `${prefix}-${session}-${counter++}`
}

export function repr(x: IBox | ITabs | IView | null | undefined): string {
  if (!x) return 'null'

  switch (x.type) {
    case 'box':
      return `${x.orientation[0]}(${repr(x.one)}, ${repr(x.two)})`
    case 'tabs':
      return x.tabs.map(v => repr(v)).join('-')
    case 'view':
      if (x.dead) return '$' + x.id
      return x.id
    default:
      return (x as { type?: string })?.type + '???'
  }
}
