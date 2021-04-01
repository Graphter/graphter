import { atom } from "recoil";
import { nanoid } from "nanoid";
import PropDataStore from "./propDataStore";

jest.mock('nanoid')
jest.mock('recoil')

const atomMock = atom as jest.Mock<any>
const nanoidMock = nanoid as jest.Mock<any>

describe('propDataStore', () => {
  let propDataStore: PropDataStore
  beforeEach(async() => {
    jest.resetAllMocks()
    atomMock.mockImplementation((options) => {
      return {
        recoilStateOptions: options
      }
    })
    nanoidMock.mockReturnValue('some-random-guid')
    jest.isolateModules(async () => {
      propDataStore = require('./propDataStore')
    })
  })
  it('should set() and get() state for a node', () => {
    propDataStore.set(['page'], 'some-data')
    expect(propDataStore.get(['page'])).toEqual({
      recoilStateOptions: {
        key: 'some-random-guid',
        default: 'some-data'
      }
    })
  })
  describe('get()', () => {
    it.each([[], null])
    ('should error if no path (i.e. %s) is supplied', (noPath) => {
      // @ts-ignore
      expect(() => propDataStore.get(noPath))
        .toThrowErrorMatchingSnapshot()
    })
    it('should error if no state is found', () => {
      expect(() => propDataStore.get(['page']))
        .toThrowErrorMatchingSnapshot()
    })
  })
  describe('set()', () => {
    it.each([[], null])
    ('should error if no path (i.e. %s) is supplied', (noPath) => {
      // @ts-ignore
      expect(() => propDataStore.set(null, 'some-data'))
        .toThrowErrorMatchingSnapshot()
    })
  })
  describe('has()', () => {
    it('should return true if the node has state', () => {
      propDataStore.set(['page'], 'some-data')
      expect(propDataStore.has(['page'])).toBe(true)
    })
    it('should return false if the node does not have state', () => {
      expect(propDataStore.has(['page'])).toBe(false)
    })
    it.each([[], null])
    ('should error if no path (i.e. %s) is supplied', (noPath) => {
      // @ts-ignore
      expect(() => propDataStore.has(noPath))
        .toThrowErrorMatchingSnapshot()
    })
  })
  describe('remove()', () => {
    it('should remove state for a node', () => {
      propDataStore.set(['page'], 'some-data')
      expect(propDataStore.has(['page'])).toBe(true)
      propDataStore.remove(['page'])
      expect(propDataStore.has(['page'])).toBe(false)
    })
    it('should remove state for an array node', () => {
      propDataStore.set(['page'], 'some-data')
      propDataStore.set(['page', 0], 'child-item-0')
      propDataStore.set(['page', 1], 'child-item-1')
      expect(propDataStore.has(['page', 1])).toBe(true)
      propDataStore.remove(['page', 0])
      expect(propDataStore.has(['page', 1])).toBe(false)
      expect(propDataStore.get(['page', 0])).toEqual({
        recoilStateOptions: {
          key: 'some-random-guid',
          default: 'child-item-1'
        }
      })
    })
    it.each([[], null])
    ('should error if no path (i.e. %s) is supplied', (noPath) => {
      // @ts-ignore
      expect(() => propDataStore.remove(noPath))
        .toThrowErrorMatchingSnapshot()
    })
  })
})
export {}