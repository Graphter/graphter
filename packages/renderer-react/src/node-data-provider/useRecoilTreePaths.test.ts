import { useRecoilValue } from "recoil";
import modelDataStore from "../store/modelDataStore";
import { useRecoilTreePaths } from './useRecoilTreePaths'
import { when } from "jest-when";

jest.mock('recoil')
jest.mock('../store/modelDataStore')

const useRecoilValueMock = useRecoilValue as jest.Mock<any>
const modelDataStoreMock = modelDataStore as jest.Mocked<any>

describe('useRecoilTreePaths', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return descendent paths', () => {
    when(modelDataStoreMock.getDescendentPaths)
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