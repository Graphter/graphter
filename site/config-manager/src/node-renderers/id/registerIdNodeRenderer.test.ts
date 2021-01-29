import IdNodeRenderer, { registerIdNodeRenderer } from "../id";

describe('registerIdNodeRenderer()', () => {
  it('should return the correct registration', async () => {
    const result = registerIdNodeRenderer()
    expect(result.type).toBe('id')
    expect(result.getChildData).toBeUndefined()
    expect(result.getChildPaths).toBeUndefined()
    expect(result.Renderer).toBe(IdNodeRenderer)
    expect(result.options).toBeUndefined()
  })
  it('should override the type if supplied in options', async () => {
    const result = registerIdNodeRenderer({ type: 'custom-id' })
    expect(result.type).toBe('custom-id')
  })
})