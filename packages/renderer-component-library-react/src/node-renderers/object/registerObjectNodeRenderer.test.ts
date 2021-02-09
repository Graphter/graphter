import { getObjectChildData } from "./getObjectChildData"
import { getObjectChildPaths } from "./getObjectChildPaths"
import ObjectNodeRenderer from "./ObjectNodeRenderer"
import { registerObjectNodeRenderer } from "./registerObjectNodeRenderer"
import { initialiseObjectData } from "./initialiseObjectData"

describe('registerObjectNodeRenderer()', () => {
  it('should return the correct registration', async () => {
    const result = registerObjectNodeRenderer()
    expect(result).toMatchSnapshot()
    expect(result.initialiseData).toBe(initialiseObjectData)
    expect(result.getChildData).toBe(getObjectChildData)
    expect(result.getChildPaths).toBe(getObjectChildPaths)
    expect(result.Renderer).toBe(ObjectNodeRenderer)
  })
  it('should override the type if supplied in options', async () => {
    const result = registerObjectNodeRenderer({ type: 'custom-object' })
    expect(result.type).toBe('custom-object')
  })
})