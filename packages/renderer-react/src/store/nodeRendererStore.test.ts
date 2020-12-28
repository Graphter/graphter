import nodeRendererStore from "./nodeRendererStore";

describe('nodeRendererStore', () => {
  it('should store node renderer registrations', () => {
    const registration = {
      type: 'some-type',
      getRenderedData: () => Promise.resolve(),
      getPaths: () => Promise.resolve([]),
      renderer: () => null
    }
    nodeRendererStore.register(registration)
    expect(nodeRendererStore.get('some-type')).toBe(registration)
  })
  it('should store multiple node renderer registrations', () => {
    const registrationA = {
      type: 'type-a',
      getRenderedData: () => Promise.resolve(),
      getPaths: () => Promise.resolve([]),
      renderer: () => null
    }
    const registrationB = {
      type: 'type-b',
      getRenderedData: () => Promise.resolve(),
      getPaths: () => Promise.resolve([]),
      renderer: () => null
    }
    nodeRendererStore.registerAll([ registrationA, registrationB ])
    expect(nodeRendererStore.get('type-a')).toBe(registrationA)
    expect(nodeRendererStore.get('type-b')).toBe(registrationB)
  })
})

export {}