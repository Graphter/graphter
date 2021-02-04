import { useRecoilValue } from "recoil";
import { useRecoilTreePaths } from './useRecoilTreePaths'
import { when } from "jest-when";
import treeDataStore from "../store/treeDataStore";

jest.mock('recoil')
jest.mock('../store/treeDataStore')

const useRecoilValueMock = useRecoilValue as jest.Mock<any>
const treeDataStoreMock = treeDataStore as jest.Mocked<any>

describe('useRecoilTreePaths', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return descendent paths', () => {
    const config = {
      id: 'some-id',
      type: 'some-type'
    }
    when(treeDataStoreMock.getDescendentPaths)
      .calledWith(config, ['some-id'])
      .mockReturnValueOnce({ some: 'state' })
    when(useRecoilValueMock)
      .calledWith({ some: 'state' })
      .mockReturnValue([ [ 'title' ], [ 'name' ] ])
    const result = useRecoilTreePaths(config, ['some-id'])
    expect(result).toEqual([ ['title'], ['name'] ])
  })
})

export {}