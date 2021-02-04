import { nodeRendererStore } from "@graphter/renderer-react";

import { getObjectChildPaths } from "./getObjectChildPaths";
import { when } from "jest-when";

const nodeRendererStoreMock  = nodeRendererStore as jest.Mocked<any>

describe('getChildPaths()', () => {
  it('should return all descendent paths', () => {
    const config = {
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
    }
    when(nodeRendererStoreMock.get)
      .calledWith('object')
      .mockReturnValueOnce({
        getChildPaths: () => ([
          ['page', 'author', 'name'],
          ['page', 'author', 'location']
        ])
      })
    const result = getObjectChildPaths(config, ['page'], jest.fn())
    expect(result).toEqual([
      ['page', 'author'],
      ['page', 'author', 'name'],
      ['page', 'author', 'location']
    ])
  })
  it.each([undefined, null])('should error if %o parent config is supplied', (noConfig) => {
    // @ts-ignore
    expect(() => getObjectChildPaths(noConfig, ['page'], jest.fn()))
      .toMatchSnapshot()
  })
  it('should skip descendent path resolution when child renderer does not implement a getChildPaths() function', () => {
    const config = {
      id: 'page',
      type: 'object',
      children: [
        { id: 'title', type: 'string' },
        { id: 'author', type: 'string' }
      ]
    }
    when(nodeRendererStoreMock.get)
      .calledWith('string')
      .mockReturnValue({})
    const getNodeValueMock = jest.fn()
    when(getNodeValueMock)
      .calledWith(['page', 'title'])
      .mockReturnValueOnce('The Page Title')
      .calledWith(['page', 'author'])
      .mockReturnValueOnce('Joe Bloggs')
    const result = getObjectChildPaths(config, ['page'], getNodeValueMock)
    expect(result).toEqual([
      ["page", "title"], ["page", "author"]
    ])
  })
})

export {}