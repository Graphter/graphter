import { useRecoilValueLoadable } from "recoil";
import { useRecoilTreePaths } from './useRecoilTreePaths'
import { when } from "jest-when";
import treeDataStore from "../store/treeDataStore";

jest.mock('recoil')
jest.mock('../store/treeDataStore')

const useRecoilValueLoadableMock = useRecoilValueLoadable as jest.Mock<any>
const treeDataStoreMock = treeDataStore as jest.Mocked<any>

describe('useRecoilTreePaths', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return descendent paths', () => {
    when(treeDataStoreMock.getDescendentPaths)
      .calledWith(['0'])
      .mockReturnValueOnce({ some: 'state' })
    when(useRecoilValueLoadableMock)
      .calledWith({ some: 'state' })
      .mockReturnValue({
        state: 'hasValue',
        contents: [ [ 'title' ], [ 'name' ] ]
      })
    const result = useRecoilTreePaths(['0'])
    expect(result).toEqual([['title'], ['name']])
  })
  it.each(['loading', 'hasError' ])
    ('should return no paths while in "%s" state', (state) => {
      when(treeDataStoreMock.getDescendentPaths)
        .calledWith(['0'])
        .mockReturnValueOnce({ some: 'state' })
      when(useRecoilValueLoadableMock)
        .calledWith({ some: 'state' })
        .mockReturnValue({
          state,
          contents: [ [ 'title' ], [ 'name' ] ]
        })
      const result = useRecoilTreePaths(['0'])
      expect(result).toEqual([])
    })
})

export {}