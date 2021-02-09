import StringNodeRenderer, { registerStringNodeRenderer } from "../string";
import { createValueInitialiser } from "@graphter/renderer-react";

const createValueInitialiserMock = createValueInitialiser as jest.Mock<any>

describe('registerStringNodeRenderer()', () => {
  beforeEach(() => {
  })
  it('should return the correct registration', async () => {
    const initFn = () => {}
    createValueInitialiserMock.mockReturnValue(initFn)
    const result = registerStringNodeRenderer()
    expect(result.Renderer).toBe(StringNodeRenderer)
    expect(result.initialiseData).toBe(initFn)
    expect(result).toMatchSnapshot()
  })
  it('should override the type if supplied in options', async () => {
    const result = registerStringNodeRenderer({ type: 'custom-string' })
    expect(result.type).toBe('custom-string')
  })
})