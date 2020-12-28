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
    when(treeDataStoreMock.getDescendentPaths)
      .calledWith(['0'])
      .mockReturnValueOnce({ some: 'state' })
    when(useRecoilValueMock)
      .calledWith({ some: 'state' })
      .mockReturnValue([['title'], ['name']])
    const result = useRecoilTreePaths(['0'])
    expect(result).toEqual([['title'], ['name']])
  })
})

export {}