import pathConfigStore from "./pathConfigStore";

describe('pathConfigStore', () => {
  it('should store config for a path', () => {
    const config = {
      id: 'some-node-config-id',
      type: 'string'
    }
    pathConfigStore.set(['page'], config)
    expect(pathConfigStore.get(['page'])).toBe(config)
  })
})