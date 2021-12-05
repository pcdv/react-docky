import { transform } from './ViewWrapper'

describe('Test', () => {
  it('Properly map transforms in ViewContainer', () => {
    expect(transform(0, 1, 'horizontal')).toBe('a1')
    expect(transform(1, 1, 'horizontal')).toBe('i1')
    expect(transform(2, 1, 'horizontal')).toBe('x1')
    expect(transform(3, 1, 'horizontal')).toBe('y1')
    expect(transform(4, 1, 'horizontal')).toBe('d1')

    expect(transform(0, 2, 'vertical')).toBe('x2')
    expect(transform(1, 2, 'vertical')).toBe('y2')
    expect(transform(2, 2, 'vertical')).toBe('a2')
    expect(transform(3, 2, 'vertical')).toBe('i2')
    expect(transform(4, 2, 'vertical')).toBe('d2')
  })
})
