import { useRecoilCallback } from 'recoil'
import { when } from "jest-when";
import { useRecoilTreeDataCallback } from "./useRecoilTreeDataCallback";
import treeDataStore from "../store/treeDataStore";

jest.mock('recoil')
jest.mock('../store/treeDataStore')

const useRecoilCallbackMock = useRecoilCallback as jest.Mock<any>
const treeDataStoreMock = treeDataStore as jest.Mocked<any>

describe('useRecoilTreeDataCallback()', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('return a callback providing integrated tree data for the descendents of a node', async () => {
    const config = { id: 'some-id', type: 'some-type' }
    when(treeDataStoreMock.getDescendentData)
      .calledWith(config, ['page'])
      .mockReturnValueOnce({
        some: 'state'
      })
    const callbackMock = jest.fn()
    useRecoilTreeDataCallback(callbackMock, config, ['page'])
    expect(useRecoilCallbackMock).toHaveBeenCalled()
    const snapshotGetPromiseMock = jest.fn().mockResolvedValueOnce({
      some: 'tree-data'
    })
    await useRecoilCallbackMock.mock.calls[0][0]({
      snapshot: {
        getPromise: snapshotGetPromiseMock
      }
    })() // Fire the callback
    expect(snapshotGetPromiseMock).toHaveBeenCalledWith({
      some: 'state'
    })
    expect(callbackMock).toHaveBeenCalledWith({
      some: 'tree-data'
    })
  })
})

export {}