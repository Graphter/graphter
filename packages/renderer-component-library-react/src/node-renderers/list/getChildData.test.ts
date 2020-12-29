import { pathConfigStore, nodeRendererStore } from "@graphter/renderer-react";
import { when } from "jest-when";
import { getChildData } from "./getChildData";

const nodeRendererStoreMock  = nodeRendererStore as jest.Mocked<any>
const pathConfigStoreMock = pathConfigStore as jest.Mocked<any>

describe('getChildData()', () => {
  it('should return descendent data correctly formed', async () => {
    const getNodeValueMock = jest.fn()
    when(getNodeValueMock)
      .calledWith(['page'])
      .mockResolvedValueOnce([ 'child-id-1', 'child-id-2' ])
    pathConfigStoreMock.get.mockReturnValue({
      type: 'object'
    })
    when(nodeRendererStoreMock.get)
      .calledWith('object')
      .mockReturnValueOnce({
        getChildData: () => Promise.resolve({ title: 'Page 0', description: 'The first' })
      })
      .mockReturnValueOnce({
        getChildData: () => Promise.resolve({ title: 'Page 1', description: 'The last' })
      })
    const result = await getChildData(['page'], getNodeValueMock)
    expect(result).toEqual([
      { title: 'Page 0', description: 'The first' },
      { title: 'Page 1', description: 'The last' }
    ])
  })
  it('should error if child config is missing', async () => {
    const getNodeValueMock = jest.fn()
    when(getNodeValueMock)
      .calledWith(['page'])
      .mockResolvedValueOnce([ 'child-id-1', 'child-id-2' ])
    pathConfigStoreMock.get.mockReturnValue(null)
    await expect(() => getChildData(['page'], getNodeValueMock))
      .rejects.toMatchSnapshot()
  })
  it('should skip descendent data resolution when child renderer does not implement a getChildData() function', async () => {
    const getNodeValueMock = jest.fn()
    when(getNodeValueMock)
      .calledWith(['page'])
      .mockResolvedValueOnce([ 'child-id-1', 'child-id-2' ])
    when(getNodeValueMock)
      .calledWith(['page', 0])
      .mockResolvedValueOnce('Page 0')
    when(getNodeValueMock)
      .calledWith(['page', 1])
      .mockResolvedValueOnce('Page 1')
    pathConfigStoreMock.get.mockReturnValue({
      type: 'string'
    })
    when(nodeRendererStoreMock.get)
      .calledWith('string')
      .mockReturnValue({})
    const result = await getChildData(['page'], getNodeValueMock)
    expect(result).toEqual([
      'Page 0',
      'Page 1'
    ])
  })
})