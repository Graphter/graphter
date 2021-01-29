import { NodeRendererStore } from "@graphter/core";

describe('nodeRendererStore', () => {
  let nodeRendererStore: NodeRendererStore
  beforeEach(() => {
    jest.isolateModules(async () => {
      nodeRendererStore = require('./nodeRendererStore').default
    })
  })
  it('should store node renderer registrations', () => {
    const registration = {
      type: 'some-type',
      name: 'Some type',
      getRenderedData: () => Promise.resolve(),
      getPaths: () => Promise.resolve([]),
      Renderer: () => null
    }
    nodeRendererStore.register(registration)
    expect(nodeRendererStore.get('some-type')).toBe(registration)
  })
  it('should store multiple node renderer registrations', () => {
    const registrationA = {
      type: 'type-a',
      name: 'Type A',
      getRenderedData: () => Promise.resolve(),
      getPaths: () => Promise.resolve([]),
      Renderer: () => null
    }
    const registrationB = {
      type: 'type-b',
      name: 'Type B',
      getRenderedData: () => Promise.resolve(),
      getPaths: () => Promise.resolve([]),
      Renderer: () => null
    }
    nodeRendererStore.registerAll([ registrationA, registrationB ])
    expect(nodeRendererStore.get('type-a')).toBe(registrationA)
    expect(nodeRendererStore.get('type-b')).toBe(registrationB)
  })
  it('should allow all registrations to be retrieved', () => {
    const registrationA = {
      type: 'type-a',
      name: 'Type A',
      getRenderedData: () => Promise.resolve(),
      getPaths: () => Promise.resolve([]),
      Renderer: () => null
    }
    const registrationB = {
      type: 'type-b',
      name: 'Type B',
      getRenderedData: () => Promise.resolve(),
      getPaths: () => Promise.resolve([]),
      Renderer: () => null
    }
    nodeRendererStore.registerAll([ registrationA, registrationB ])
    expect(nodeRendererStore.getAll()).toEqual([
      registrationA,
      registrationB
    ])
  })
})

export {}