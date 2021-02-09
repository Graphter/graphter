import { createValueInitialiser } from "./createValueInitialiser";

describe('createValueInitialiser()', () => {
  it('should create a callback function that initialises a node value', () => {
    const init = createValueInitialiser('some-fallback-value')
    const initMock = jest.fn()
    init(
      { id: 'some-id', type: 'some-type' },
      [ 'model-id', 'instance-id', 'some' ],
      { some: 'data' },
      initMock
    )
    expect(initMock).toHaveBeenCalledWith(['model-id', 'instance-id', 'some'], 'data')
  })
  it('should use the supplied fallback value when original data is ' +
    'missing and no default value is defined in config', () => {
    const init = createValueInitialiser('the-fallback-value')
    const initMock = jest.fn()
    init(
      { id: 'some-id', type: 'some-type' },
      [ 'model-id', 'instance-id', 'some-other' ],
      { some: 'data' },
      initMock
    )
    expect(initMock).toHaveBeenCalledWith(['model-id', 'instance-id', 'some-other'], 'the-fallback-value')
  })
})
export {}