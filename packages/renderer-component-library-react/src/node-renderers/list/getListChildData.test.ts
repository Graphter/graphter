import { nodeRendererStore } from "@graphter/renderer-react";
import { when } from "jest-when";
import { getListChildData } from "./getListChildData";

const nodeRendererStoreMock  = nodeRendererStore as jest.Mocked<any>

describe('getChildData()', () => {
  it('should return descendent data correctly formed', () => {
    const getNodeValueMock = jest.fn()
    when(getNodeValueMock)
      .calledWith(['page'])
      .mockReturnValueOnce([ 'child-id-1', 'child-id-2' ])
    const config = {
      id: 'some-id',
      type: 'object',
      children: [
        { id: 'some-child-id', type: 'object' }
      ]
    }
    when(nodeRendererStoreMock.get)
      .calledWith('object')
      .mockReturnValueOnce({
        getChildData: () => ({ title: 'Page 0', description: 'The first' })
      })
      .mockReturnValueOnce({
        getChildData: () => ({ title: 'Page 1', description: 'The last' })
      })
    const result = getListChildData(config, ['page'], getNodeValueMock)
    expect(result).toEqual([
      { title: 'Page 0', description: 'The first' },
      { title: 'Page 1', description: 'The last' }
    ])
  })
  it.each([ null, undefined ])('should error if %o child config is supplied', (noConfig) => {
    const getNodeValueMock = jest.fn()
    when(getNodeValueMock)
      .calledWith(['page'])
      .mockReturnValueOnce([ 'child-id-1', 'child-id-2' ])
    // @ts-ignore
    expect(() => getListChildData(noConfig, ['page'], getNodeValueMock))
      .toMatchSnapshot()
  })
  it('should skip descendent data resolution when child renderer does not implement a getChildData() function', () => {
    const getNodeValueMock = jest.fn()
    when(getNodeValueMock)
      .calledWith(['page'])
      .mockReturnValueOnce([ 'child-id-1', 'child-id-2' ])
    when(getNodeValueMock)
      .calledWith(['page', 0])
      .mockReturnValueOnce('Page 0')
    when(getNodeValueMock)
      .calledWith(['page', 1])
      .mockReturnValueOnce('Page 1')
    const config = {
      id: 'some-id',
      type: 'string',
      children: [
        { id: 'some-child-id', type: 'string' }
      ]
    }
    when(nodeRendererStoreMock.get)
      .calledWith('string')
      .mockReturnValue({})
    const result = getListChildData(config, ['page'], getNodeValueMock)
    expect(result).toEqual([
      'Page 0',
      'Page 1'
    ])
  })
})