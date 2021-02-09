import { registerListNodeRenderer } from "./registerListNodeRenderer";
import { getListChildData } from "./getListChildData";
import { getListChildPaths } from "./getListChildPaths";
import { initialiseListData } from "./initialiseListData";
import ListNodeRenderer from "./ListNodeRenderer";

describe('registerListNodeRenderer()', () => {
  it('should return the correct registration', () => {
    const result = registerListNodeRenderer()
    expect(result).toMatchSnapshot()
    expect(result.initialiseData).toBe(initialiseListData)
    expect(result.getChildData).toBe(getListChildData)
    expect(result.getChildPaths).toBe(getListChildPaths)
    expect(result.Renderer).toBe(ListNodeRenderer)
  })
  it('should override the type if supplied in options', () => {
    const result = registerListNodeRenderer({ type: 'custom-list' })
    expect(result.type).toBe('custom-list')
  })
})
export {}