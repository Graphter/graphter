import StringNodeRenderer, { registerStringNodeRenderer } from "../string";

describe('registerStringNodeRenderer()', () => {
  it('should return the correct registration', async () => {
    const result = registerStringNodeRenderer()
    expect(result.type).toBe('string')
    expect(result.getChildData).toBeUndefined()
    expect(result.getChildPaths).toBeUndefined()
    expect(result.Renderer).toBe(StringNodeRenderer)
    expect(result.options).toBeUndefined()
  })
  it('should override the type if supplied in options', async () => {
    const result = registerStringNodeRenderer({ type: 'custom-string' })
    expect(result.type).toBe('custom-string')
  })
})