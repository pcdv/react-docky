import { IBox, ITabs, IView } from './types'

// hack to avoid ID collision with samples (need a better way)
let counter = 1000
export function genId(prefix: string): string {
  return prefix + counter++
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
      return (x as any)?.type + '???'
  }
}
