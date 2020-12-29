import { pathConfigStore, nodeRendererStore } from "@graphter/renderer-react";
import { when } from "jest-when";
import { getChildData } from "./getChildData";

const nodeRendererStoreMock  = nodeRendererStore as jest.Mocked<any>
const pathConfigStoreMock = pathConfigStore as jest.Mocked<any>

describe('getChildData()', () => {
  it('should return descendent data correctly formed', async () => {
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
        getChildData: () => Promise.resolve({ name: 'Bob', location: 'London' })
      })
    const result = await getChildData(['page'], jest.fn())
    expect(result).toEqual({
      author: { name: 'Bob', location: 'London' }
    })
  })
  it('should error if parent config is not found', async () => {
    pathConfigStoreMock.get.mockReturnValue(null)
    await expect(() => getChildData(['page'], jest.fn()))
      .rejects.toThrowErrorMatchingSnapshot()
  })
  it.each([[], null])
    ('should error if the parent has no children (i.e. %s) configured', async (noChildren) => {
    pathConfigStoreMock.get.mockReturnValue({
      id: 'page',
      type: 'object',
      children: noChildren
    })
    when(nodeRendererStoreMock.get)
      .calledWith('object')
      .mockReturnValueOnce({
        getChildData: () => Promise.resolve({ name: 'Bob', location: 'London' })
      })
    await expect(() => getChildData(['page'], jest.fn()))
      .rejects.toThrowErrorMatchingSnapshot()
  })
  it('should skip descendent data resolution when child renderer does not implement a getChild() function', async () => {
    const getNodeValueMock = jest.fn()
    pathConfigStoreMock.get.mockReturnValueOnce({
      id: 'page',
      type: 'object',
      children: [
        {
          id: 'title',
          type: 'string'
        }
      ]
    })
    when(nodeRendererStoreMock.get)
      .calledWith('string')
      .mockReturnValueOnce({ })
    when(getNodeValueMock)
      .calledWith(['page', 'title'])
      .mockResolvedValueOnce('The Page Title')
    const result = await getChildData(['page'], getNodeValueMock)
    expect(result).toEqual({
      title: 'The Page Title'
    })
  })
})