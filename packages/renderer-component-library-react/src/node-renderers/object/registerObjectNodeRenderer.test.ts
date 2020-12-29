import { getChildData } from "./getChildData";
import { getChildPaths } from "./getChildPaths";
import ObjectNodeRenderer from "./ObjectNodeRenderer";
import { registerObjectNodeRenderer } from "./registerObjectNodeRenderer";

describe('registerObjectNodeRenderer()', () => {
  it('should return the correct registration', async () => {
    const result = registerObjectNodeRenderer()
    expect(result.type).toBe('object')
    expect(result.getChildData).toBe(getChildData)
    expect(result.getChildPaths).toBe(getChildPaths)
    expect(result.renderer).toBe(ObjectNodeRenderer)
    expect(result.options).toBeUndefined()
  })
  it('should override the type if supplied in options', async () => {
    const result = registerObjectNodeRenderer({ type: 'custom-object' })
    expect(result.type).toBe('custom-object')
  })
})