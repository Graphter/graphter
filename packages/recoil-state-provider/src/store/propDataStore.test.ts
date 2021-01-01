import { atom } from "recoil";
import { nanoid } from "nanoid";
import PropDataStore from "./propDataStore";

jest.mock('nanoid')
jest.mock('recoil')

const atomMock = atom as jest.Mock<any>
const nanoidMock = nanoid as jest.Mock<any>

atomMock.mockImplementation((options) => {
  return {
    recoilStateOptions: options
  }
})
nanoidMock.mockReturnValue('some-random-guid')

describe('propDataStore', () => {
  let propDataStore: PropDataStore
  beforeEach(async() => {
    jest.isolateModules(async () => {
      propDataStore = require('./propDataStore')
    })
  })
  it('should set() and get() state for a node', () => {
    propDataStore.set(['page'], true, 'some-data')
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
  describe('getAll()', () => {
    it('should return child states for a node', () => {
      propDataStore.set(['page'], true, [ 'child-item-0-id', 'child-item-1-id' ])
      propDataStore.set(['page', 0], true, 'child-item-0')
      propDataStore.set(['page', 1], true, 'child-item-1')
      expect(propDataStore.getAll(['page'])).toEqual([
        {
          recoilStateOptions: {
            key: 'some-random-guid',
            default: 'child-item-0'
          }
        },
        {
          recoilStateOptions: {
            key: 'some-random-guid',
            default: 'child-item-1'
          }
        }
      ])
    })
    it('should exclude child states that are not committed', () => {
      propDataStore.set(['page', 0], true, 'child-item-0')
      propDataStore.set(['page', 1], true, 'child-item-1')
      propDataStore.set(['page', 2], false, 'child-item-2')
      expect(propDataStore.getAll(['page'])).toEqual([
        {
          recoilStateOptions: {
            key: 'some-random-guid',
            default: 'child-item-0'
          }
        },
        {
          recoilStateOptions: {
            key: 'some-random-guid',
            default: 'child-item-1'
          }
        }
      ])
    })
    it.each([[], null])
    ('should error if no path (i.e. %s) is supplied', (noPath) => {
      // @ts-ignore
      expect(() => propDataStore.getAll(noPath))
        .toThrowErrorMatchingSnapshot()
    })
    it('should error if node has no children', () => {
      propDataStore.set(['page'], true, 'some-data')
      expect(() => propDataStore.getAll(['page']))
        .toThrowErrorMatchingSnapshot()
    })
  })
  describe('set()', () => {
    it.each([[], null])
    ('should error if no path (i.e. %s) is supplied', (noPath) => {
      // @ts-ignore
      expect(() => propDataStore.set(null, true, 'some-data'))
        .toThrowErrorMatchingSnapshot()
    })
  })
  describe('commitItem()', () => {
    it('should mark a node as committed', () => {
      propDataStore.set(['page', 0], true, 'child-item-0')
      propDataStore.set(['page', 1], true, 'child-item-1')
      propDataStore.set(['page', 2], false, 'child-item-2')
      expect(propDataStore.getAll(['page']).length).toBe(2)
      propDataStore.commitItem(['page', 2])
      expect(propDataStore.getAll(['page']).length).toBe(3)
    })
    it.each([[], null])
    ('should error if no path (i.e. %s) is supplied', (noPath) => {
      // @ts-ignore
      expect(() => propDataStore.commitItem(noPath))
        .toThrowErrorMatchingSnapshot()
    })
  })
  describe('has()', () => {
    it('should return true if the node has state', () => {
      propDataStore.set(['page'], true, 'some-data')
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
      propDataStore.set(['page'], true, 'some-data')
      expect(propDataStore.has(['page'])).toBe(true)
      propDataStore.remove(['page'])
      expect(propDataStore.has(['page'])).toBe(false)
    })
    it('should remove state for an array node', () => {
      propDataStore.set(['page'], true, 'some-data')
      propDataStore.set(['page', 0], true, 'child-item-0')
      propDataStore.set(['page', 1], true, 'child-item-1')
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