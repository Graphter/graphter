import { pathConfigStore, nodeRendererStore } from "@graphter/renderer-react";

import { getListChildPaths } from "./getListChildPaths";
import { when } from "jest-when";

const nodeRendererStoreMock  = nodeRendererStore as jest.Mocked<any>
const pathConfigStoreMock = pathConfigStore as jest.Mocked<any>

describe('getChildPaths()', () => {
  it('should return all descendent paths', () => {
    const getNodeValueMock = jest.fn()
    when(getNodeValueMock)
      .calledWith(['page'])
      .mockReturnValueOnce(['child-id-a', 'child-id-b'])
    pathConfigStoreMock.get
      .mockReturnValue({
        type: 'object'
      })
    when(nodeRendererStoreMock.get)
      .calledWith('object')
      .mockReturnValueOnce({
        getChildPaths: () => ([ ['page', 0, 'title'] ])
      })
      .mockReturnValueOnce({
        getChildPaths: () => ([ ['page', 1, 'title'] ])
      })
    const result = getListChildPaths(['page'], getNodeValueMock)
    expect(result).toEqual([
      ['page', 0],
      ['page', 0, 'title'],
      ['page', 1],
      ['page', 1, 'title']
    ])
  })
  it('should error if no config is found for a child item', () => {
    const getNodeValueMock = jest.fn()
    when(getNodeValueMock)
      .calledWith(['page'])
      .mockReturnValueOnce(['child-id-a', 'child-id-b'])
    pathConfigStoreMock.get
      .mockReturnValue(null)
    expect(() => getListChildPaths(['page'], getNodeValueMock))
      .toMatchSnapshot()
  })
  it('should skip descendent path resolution when child renderer does not implement a getChildPaths() function', () => {
    const getNodeValueMock = jest.fn()
    when(getNodeValueMock)
      .calledWith(['page'])
      .mockReturnValueOnce(['child-id-a', 'child-id-b'])
    pathConfigStoreMock.get
      .mockReturnValue({
        type: 'string'
      })
    when(nodeRendererStoreMock.get)
      .calledWith('string')
      .mockReturnValue({})
    const result = getListChildPaths(['page'], getNodeValueMock)
    expect(result).toEqual([
      ['page', 0],
      ['page', 1],
    ])
  })
})

export {}