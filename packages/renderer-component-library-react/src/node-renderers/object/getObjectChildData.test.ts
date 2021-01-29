import { pathConfigStore, nodeRendererStore } from "@graphter/renderer-react";
import { when } from "jest-when";
import { getObjectChildData } from "./getObjectChildData";

const nodeRendererStoreMock  = nodeRendererStore as jest.Mocked<any>
const pathConfigStoreMock = pathConfigStore as jest.Mocked<any>

describe('getChildData()', () => {
  it('should return descendent data correctly formed', () => {
    pathConfigStoreMock.get.mockReturnValueOnce({
      id: 'page',
      type: 'object',
      children: [
        {
          id: 'author',
          type: 'object',
          children: [ // Just here for illustration; don't actually do anything in the test
            { id: 'name', type: 'string' },
            { id: 'location', type: 'string' }
          ]
        }
      ]
    })
    when(nodeRendererStoreMock.get)
      .calledWith('object')
      .mockReturnValueOnce({
        getChildData: () => ({ name: 'Bob', location: 'London' })
      })
    const result = getObjectChildData(['page'], jest.fn())
    expect(result).toEqual({
      author: { name: 'Bob', location: 'London' }
    })
  })
  it('should error if parent config is not found', () => {
    pathConfigStoreMock.get.mockReturnValue(null)
    expect(() => getObjectChildData(['page'], jest.fn()))
      .toThrowErrorMatchingSnapshot()
  })
  it.each([[], null])
    ('should error if the parent has no children (i.e. %s) configured', (noChildren) => {
    pathConfigStoreMock.get.mockReturnValue({
      id: 'page',
      type: 'object',
      children: noChildren
    })
    when(nodeRendererStoreMock.get)
      .calledWith('object')
      .mockReturnValueOnce({
        getChildData: () => ({ name: 'Bob', location: 'London' })
      })
    expect(() => getObjectChildData(['page'], jest.fn()))
      .toThrowErrorMatchingSnapshot()
  })
  it('should skip descendent data resolution when child renderer does not implement a getChild() function', () => {
    const getNodeValueMock = jest.fn()
    pathConfigStoreMock.get.mockReturnValueOnce({
      id: 'page',
      type: 'object',
      children: [
        { id: 'title', type: 'string' },
        { id: 'author', type: 'string' }
      ]
    })
    when(nodeRendererStoreMock.get)
      .calledWith('string')
      .mockReturnValue({ })
    when(getNodeValueMock)
      .calledWith(['page', 'title'])
      .mockReturnValueOnce('The Page Title')
      .calledWith(['page', 'author'])
      .mockReturnValueOnce('Joe Bloggs')
    const result = getObjectChildData(['page'], getNodeValueMock)
    expect(result).toEqual({
      title: 'The Page Title',
      author: 'Joe Bloggs'
    })
  })
})