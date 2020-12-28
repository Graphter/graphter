import { useRecoilCallback } from 'recoil'
import { when } from "jest-when";
import { useRecoilTreeData } from "./useRecoilTreeData";
import treeDataStore from "../store/treeDataStore";

jest.mock('recoil')
jest.mock('../store/treeDataStore')

const useRecoilCallbackMock = useRecoilCallback as jest.Mock<any>
const treeDataStoreMock = treeDataStore as jest.Mocked<any>

describe('useRecoilNodeData()', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('return a callback providing tree data integrated from the provided path', async () => {
    when(treeDataStoreMock.get)
      .calledWith(['/'])
      .mockReturnValueOnce({
        some: 'state'
      })
    const callbackMock = jest.fn()
    useRecoilTreeData(callbackMock, ['/'])
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