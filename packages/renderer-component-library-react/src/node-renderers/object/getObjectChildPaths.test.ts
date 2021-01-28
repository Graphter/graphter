import { pathConfigStore, nodeRendererStore } from "@graphter/renderer-react";

import { getObjectChildPaths } from "./getObjectChildPaths";
import { when } from "jest-when";

const nodeRendererStoreMock  = nodeRendererStore as jest.Mocked<any>
const pathConfigStoreMock = pathConfigStore as jest.Mocked<any>

describe('getChildPaths()', () => {
  it('should return all descendent paths', async () => {
    pathConfigStoreMock.get.mockReturnValue({
      id: 'page',
      type: 'object',
      children: [
        {
          id: 'author',
          type: 'object',
          children: [ // Just here for illustration; don't actually do anything in the test
            { id: 'name', type: 'string' }
          ]
        }
      ]
    })
    when(nodeRendererStoreMock.get)
      .calledWith('object')
      .mockReturnValueOnce({
        getChildPaths: () => Promise.resolve([
          ['page', 'author', 'name'],
          ['page', 'author', 'location']
        ])
      })
    const result = await getObjectChildPaths(['page'], jest.fn())
    expect(result).toEqual([
      ['page', 'author'],
      ['page', 'author', 'name'],
      ['page', 'author', 'location']
    ])
  })
  it('should error if no parent config is found', async () => {
    pathConfigStoreMock.get
      .mockReturnValue(null)
    await expect(() => getObjectChildPaths(['page'], jest.fn()))
      .rejects.toMatchSnapshot()
  })
  it('should skip descendent path resolution when child renderer does not implement a getChildPaths() function', async () => {
    pathConfigStoreMock.get.mockReturnValue({
      id: 'page',
      type: 'object',
      children: [
        { id: 'title', type: 'string' },
        { id: 'author', type: 'string' }
      ]
    })
    when(nodeRendererStoreMock.get)
      .calledWith('string')
      .mockReturnValue({})
    const getNodeValueMock = jest.fn()
    when(getNodeValueMock)
      .calledWith(['page', 'title'])
      .mockResolvedValueOnce('The Page Title')
      .calledWith(['page', 'author'])
      .mockResolvedValueOnce('Joe Bloggs')
    const result = await getObjectChildPaths(['page'], getNodeValueMock)
    expect(result).toEqual([
      ["page", "title"], ["page", "author"]
    ])
  })
})

export {}