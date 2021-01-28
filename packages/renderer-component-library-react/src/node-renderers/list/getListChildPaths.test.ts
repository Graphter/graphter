import { pathConfigStore, nodeRendererStore } from "@graphter/renderer-react";

import { getListChildPaths } from "./getListChildPaths";
import { when } from "jest-when";

const nodeRendererStoreMock  = nodeRendererStore as jest.Mocked<any>
const pathConfigStoreMock = pathConfigStore as jest.Mocked<any>

describe('getChildPaths()', () => {
  it('should return all descendent paths', async () => {
    const getNodeValueMock = jest.fn()
    when(getNodeValueMock)
      .calledWith(['page'])
      .mockResolvedValueOnce(['child-id-a', 'child-id-b'])
    pathConfigStoreMock.get
      .mockReturnValue({
        type: 'object'
      })
    when(nodeRendererStoreMock.get)
      .calledWith('object')
      .mockReturnValueOnce({
        getChildPaths: () => Promise.resolve([ ['page', 0, 'title'] ])
      })
      .mockReturnValueOnce({
        getChildPaths: () => Promise.resolve([ ['page', 1, 'title'] ])
      })
    const result = await getListChildPaths(['page'], getNodeValueMock)
    expect(result).toEqual([
      ['page', 0],
      ['page', 0, 'title'],
      ['page', 1],
      ['page', 1, 'title']
    ])
  })
  it('should error if no config is found for a child item', async () => {
    const getNodeValueMock = jest.fn()
    when(getNodeValueMock)
      .calledWith(['page'])
      .mockResolvedValueOnce(['child-id-a', 'child-id-b'])
    pathConfigStoreMock.get
      .mockReturnValue(null)
    await expect(() => getListChildPaths(['page'], getNodeValueMock))
      .rejects.toMatchSnapshot()
  })
  it('should skip descendent path resolution when child renderer does not implement a getChildPaths() function', async () => {
    const getNodeValueMock = jest.fn()
    when(getNodeValueMock)
      .calledWith(['page'])
      .mockResolvedValueOnce(['child-id-a', 'child-id-b'])
    pathConfigStoreMock.get
      .mockReturnValue({
        type: 'string'
      })
    when(nodeRendererStoreMock.get)
      .calledWith('string')
      .mockReturnValue({})
    const result = await getListChildPaths(['page'], getNodeValueMock)
    expect(result).toEqual([
      ['page', 0],
      ['page', 1],
    ])
  })
})

export {}