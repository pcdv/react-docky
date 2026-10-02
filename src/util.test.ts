import { describe, expect, it, vi } from 'vitest'

describe('genId', () => {
  it('generates unique ids', async () => {
    const { genId } = await import('./util.js')
    expect(genId('box')).not.toBe(genId('box'))
  })

  it('does not generate the ids of an earlier page load, which may be in a saved layout', async () => {
    vi.resetModules()
    const earlier = (await import('./util.js')).genId('box')
    vi.resetModules()
    const now = (await import('./util.js')).genId('box')
    expect(now).not.toBe(earlier)
  })
})
