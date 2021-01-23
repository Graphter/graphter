import { registerListNodeRenderer } from "./registerListNodeRenderer";
import { getChildData } from "./getChildData";
import { getChildPaths } from "./getChildPaths";
import ListNodeRenderer from "./ListNodeRenderer";

describe('registerListNodeRenderer()', () => {
  it('should return the correct registration', () => {
    const result = registerListNodeRenderer()
    expect(result).toMatchSnapshot()
    expect(result.getChildData).toBe(getChildData)
    expect(result.getChildPaths).toBe(getChildPaths)
    expect(result.Renderer).toBe(ListNodeRenderer)
  })
  it('should override the type if supplied in options', () => {
    const result = registerListNodeRenderer({ type: 'custom-list' })
    expect(result.type).toBe('custom-list')
  })
})
export {}