import { createDefault } from "./node";

describe('node', () => {
  it('should create the default from a factory if function is defined', () => {
    const result = createDefault({
      id: 'some-id',
      type: 'string',
      default: () => 'bob'
    })
    expect(result).toBe('bob')
  })
  it('should deep clone the default value if a non-function value is defined', () => {
    const defaultValue = { foo: 'bar' }
    const result = createDefault({
      id: 'some-id',
      type: 'string',
      default: defaultValue
    })
    expect(result).toEqual(defaultValue)
    expect(result).not.toBe(defaultValue)
  })
  it('should error if no default value is defined', () => {    const defaultValue = { foo: 'bar' }
    expect(() => {
      createDefault({
        id: 'some-id',
        type: 'string'
      })
    }).toThrowErrorMatchingSnapshot()
  })
})
export {}