import { nodeRendererStore } from "@graphter/renderer-react";

import { getListChildPaths } from "./getListChildPaths";
import { when } from "jest-when";

const nodeRendererStoreMock = nodeRendererStore as jest.Mocked<any>

describe('getChildPaths()', () => {
  it('should return all descendent paths', () => {
    const getNodeValueMock = jest.fn()
    when(getNodeValueMock)
      .calledWith([ 'page' ])
      .mockReturnValueOnce([ 'child-id-a', 'child-id-b' ])
    const config = {
      id: 'page',
      type: 'object',
      children: [
        {
          id: 'some-child-id',
          type: 'list',
        }
      ]
    }
    when(nodeRendererStoreMock.get)
      .calledWith('list')
      .mockReturnValueOnce({
        getChildPaths: () => ([ [ 'page', 0, 'title' ] ])
      })
      .mockReturnValueOnce({
        getChildPaths: () => ([ [ 'page', 1, 'title' ] ])
      })
    const result = getListChildPaths(config, [ 'page' ], getNodeValueMock)
    expect(result).toEqual([
      [ 'page', 0 ],
      [ 'page', 0, 'title' ],
      [ 'page', 1 ],
      [ 'page', 1, 'title' ]
    ])
  })
  it.each([ null, undefined ])('should error if %o config is found for a child item', (noConfig) => {
    const getNodeValueMock = jest.fn()
    when(getNodeValueMock)
      .calledWith([ 'page' ])
      .mockReturnValueOnce([ 'child-id-a', 'child-id-b' ])
    // @ts-ignore
    expect(() => getListChildPaths(noConfig, [ 'page' ], getNodeValueMock))
      .toMatchSnapshot()
  })
  it('should skip descendent path resolution when child renderer does not implement a getChildPaths() function', () => {
    const getNodeValueMock = jest.fn()
    when(getNodeValueMock)
      .calledWith([ 'page' ])
      .mockReturnValueOnce([ 'child-id-a', 'child-id-b' ])
    const config = {
      id: 'some-config',
      type: 'string',
      children: [
        {
          id: 'some-child-id',
          type: 'string'
        }
      ]
    }
    when(nodeRendererStoreMock.get)
      .calledWith('string')
      .mockReturnValue({})
    const result = getListChildPaths(config, [ 'page' ], getNodeValueMock)
    expect(result).toEqual([
      [ 'page', 0 ],
      [ 'page', 1 ],
    ])
  })
})

export {}