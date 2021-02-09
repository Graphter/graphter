import { propDataStore } from "../store/propDataStore";
import { nodeRendererStore } from "@graphter/renderer-react";
import { when } from "jest-when";
import { useRecoilTreeDataInitialiser } from "./useRecoilTreeDataInitialiser";

jest.mock('../store/propDataStore')

const nodeRendererStoreMock = nodeRendererStore as jest.Mocked<any>

describe('useRecoilTreeDataInitialiser()', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  it('should start initialising state from the top node downward', () => {
    const initMock = jest.fn()
    when(nodeRendererStoreMock.get)
      .calledWith('some-type')
      .mockReturnValueOnce({
        initialiseData: initMock
      })
    const init = useRecoilTreeDataInitialiser()
    init(
      { id: 'some-id', type: 'some-type' },
      [ 'page' ],
      { some: 'data' }
    )
    expect(initMock).toHaveBeenCalled()
    const params = initMock.mock.calls[0]
    expect(params).toMatchSnapshot()
    expect(propDataStore.set).not.toHaveBeenCalled()
    params[3](
      [ 'page', 'body' ],
      { someOther: 'data' }
    )
    expect(propDataStore.set).toHaveBeenCalledWith(
      [ 'page', 'body' ],
      true,
      { someOther: 'data' }
    )
  })
  it(`should throw if a renderer can't be found for the top node`, () => {
    nodeRendererStoreMock.get.mockReturnValueOnce(null)
    const init = useRecoilTreeDataInitialiser()
    expect(() => init(
      { id: 'some-id', type: 'some-type' },
      [ 'page' ],
      { some: 'data' }
    )).toThrowErrorMatchingSnapshot()
  })
  it(`should initialise the entire tree if the top node renderer registration doesn't have an init fn`, () => {
    when(nodeRendererStoreMock.get)
      .calledWith('some-type')
      .mockReturnValueOnce({ })
    const init = useRecoilTreeDataInitialiser()
    init(
      { id: 'some-id', type: 'some-type' },
      [ 'page' ],
      { some: 'data' }
    )
    expect(propDataStore.set).toHaveBeenCalledWith(
      [ 'page' ],
      true,
      { some: 'data' }
    )
  })
})
export {}