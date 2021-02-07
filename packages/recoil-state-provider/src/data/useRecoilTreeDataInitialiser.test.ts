import { propDataStore } from "../store/propDataStore";
import { useRecoilTreeDataInitialiser } from "./useRecoilTreeDataInitialiser";

jest.mock('../store/propDataStore')

describe('useRecoilTreeDataInitialiser()', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  it('should return a callback fn that initialises tree data', () => {
    const cb = useRecoilTreeDataInitialiser()
    cb(['page'], { title: 'The page title' })
    expect(propDataStore.init).toHaveBeenCalledWith(['page'], { title: 'The page title' })
  })
  it('should return a callback fn that returns if no original tree data is passed', () => {
    const cb = useRecoilTreeDataInitialiser()
    cb(['page'], undefined)
    expect(propDataStore.init).not.toHaveBeenCalled()
  })
})
export {}