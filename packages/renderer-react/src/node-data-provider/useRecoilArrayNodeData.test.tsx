import React from 'react'
import useRecoilArrayNodeData from "./useRecoilArrayNodeData"
import useRecoilNodeData from './useRecoilNodeData'
import { nanoid } from 'nanoid'
import { act, fireEvent, render } from "@testing-library/react"
import propDataStore from "../store/propDataStore";

jest.mock('nanoid')
jest.mock('./useRecoilNodeData')
jest.mock('../store/propDataStore')

const nanoidMock = nanoid as jest.Mock<any>
const useRecoilNodeDataMock = useRecoilNodeData as jest.Mock<any>
const propDataStoreMock = propDataStore as jest.Mocked<any>

function ConsumerMock(props: any){
  const {
    childIds,
    removeItem,
    commitItem
  } = useRecoilArrayNodeData(props.path, props.config, props.originalNodeData, props.committed)
  return (
    <div>
      {childIds.map(childId => <div key={childId}>{childId}</div>)}
      <button onClick={() => removeItem(1)}>Remove item</button>
      <button onClick={() => commitItem(2)}>Commit item</button>
    </div>
  )
}

describe('useRecoilArrayNodeData()', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should create a set of unique child item IDs and use them for the lifetime of the hook', () => {
    nanoidMock.mockReturnValueOnce('uniqueID1a')
    nanoidMock.mockReturnValueOnce('uniqueID2a')
    useRecoilNodeDataMock.mockReturnValue([[ 'uniqueID1b', 'uniqueID2b' ], () => {}])
    const { container, getByText } = render(
      <ConsumerMock
        path={['/']}
        config={{}}
        originalNodeData={[ 'tagA', 'tagB' ]}
        committed={true}
      />
    )
    expect(getByText('uniqueID1b')).not.toBeNull()
    expect(getByText('uniqueID2b')).not.toBeNull()

    render(
      <ConsumerMock
        path={['/']}
        config={{}}
        originalNodeData={[ 'tagA', 'tagB' ]}
        committed={true}
      />
      , { container })
    expect(nanoidMock).toHaveBeenCalledTimes(2)
  })
  it('should store the child IDs as node data', () => {
    nanoidMock.mockReturnValueOnce('unique-id-1-a')
    nanoidMock.mockReturnValueOnce('unique-id-2-a')
    useRecoilNodeDataMock.mockReturnValue([[ 'unique-id-1-b', 'unique-id-2-b' ], () => {}])
    render(
      <ConsumerMock
        path={['/']}
        config={{}}
        originalNodeData={[ 'tagA', 'tagB' ]}
        committed={true}
      />
    )
    expect(useRecoilNodeDataMock).toHaveBeenCalledWith(
      ['/'],
      {},
      [ 'unique-id-1-a', 'unique-id-2-a' ],
      true
    )
  })
  describe('when removeItem callback is invoked', () => {
    it('should remove the child id at the given index', () => {
      const setChildIdsMock = jest.fn()
      useRecoilNodeDataMock.mockReturnValueOnce([ [ 'unique-id-1', 'unique-id-2' ], setChildIdsMock ])
      const { getByText } = render(
        <ConsumerMock
          path={['/']}
          config={{}}
          originalNodeData={[ 'tagA', 'tagB' ]}
          committed={true}
        />
      )
      act(() => {
        fireEvent.click(getByText('Remove item'))
      })
      expect(setChildIdsMock).toHaveBeenCalledWith([ 'unique-id-1' ])
    })
    it('should not mutate the child ID array', () => {
      const childIds = [ 'unique-id-1', 'unique-id-2' ]
      const setChildIdsMock = jest.fn()
      useRecoilNodeDataMock.mockReturnValueOnce([ childIds, setChildIdsMock ])
      const { getByText } = render(
        <ConsumerMock
          path={['/']}
          config={{}}
          originalNodeData={[ 'tagA', 'tagB' ]}
          committed={true}
        />
      )
      act(() => {
        fireEvent.click(getByText('Remove item'))
      })
      expect(setChildIdsMock).toHaveBeenCalled()
      expect(setChildIdsMock.mock.calls[0][0]).not.toBe(childIds)
    })
    it('should remove the child data from the prop data store', () => {
      const childIds = [ 'unique-id-1', 'unique-id-2' ]
      const setChildIdsMock = jest.fn()
      useRecoilNodeDataMock.mockReturnValueOnce([ childIds, setChildIdsMock ])
      const { getByText } = render(
        <ConsumerMock
          path={['/']}
          config={{}}
          originalNodeData={[ 'tagA', 'tagB' ]}
          committed={true}
        />
      )
      act(() => {
        fireEvent.click(getByText('Remove item'))
      })
      expect(propDataStoreMock.remove).toHaveBeenCalledWith(['/', 1])
    })
  })
  describe('when commitItem callback is invoked' , () => {
    it('should commit the data at the given index', () => {
      nanoidMock.mockReturnValueOnce('unique-id-1')
      nanoidMock.mockReturnValueOnce('unique-id-2')
      nanoidMock.mockReturnValueOnce('unique-id-3')
      const childIds = [ 'unique-id-1', 'unique-id-2' ]
      const setChildIdsMock = jest.fn()
      useRecoilNodeDataMock.mockReturnValueOnce([ childIds, setChildIdsMock ])
      const { getByText } = render(
        <ConsumerMock
          path={['/']}
          config={{}}
          originalNodeData={[ 'tagA', 'tagB' ]}
          committed={true}
        />
      )
      act(() => {
        fireEvent.click(getByText('Commit item'))
      })
      expect(setChildIdsMock).toHaveBeenCalledWith([ 'unique-id-1', 'unique-id-2', 'unique-id-3' ])
    })
    it('should not mutate the child ID array', () => {
      nanoidMock.mockReturnValueOnce('unique-id-1')
      nanoidMock.mockReturnValueOnce('unique-id-2')
      nanoidMock.mockReturnValueOnce('unique-id-3')
      const childIds = [ 'unique-id-1', 'unique-id-2' ]
      const setChildIdsMock = jest.fn()
      useRecoilNodeDataMock.mockReturnValueOnce([ childIds, setChildIdsMock ])
      const { getByText } = render(
        <ConsumerMock
          path={['/']}
          config={{}}
          originalNodeData={[ 'tagA', 'tagB' ]}
          committed={true}
        />
      )
      act(() => {
        fireEvent.click(getByText('Commit item'))
      })
      expect(setChildIdsMock).toHaveBeenCalledWith([ 'unique-id-1', 'unique-id-2', 'unique-id-3' ])
    })
    it('should commit the child data in the prop data store', () => {
      nanoidMock.mockReturnValueOnce('unique-id-1')
      nanoidMock.mockReturnValueOnce('unique-id-2')
      nanoidMock.mockReturnValueOnce('unique-id-3')
      useRecoilNodeDataMock.mockReturnValueOnce([ [ 'unique-id-1', 'unique-id-2' ], () => {} ])
      const { getByText } = render(
        <ConsumerMock
          path={['/']}
          config={{}}
          originalNodeData={[ 'tagA', 'tagB' ]}
          committed={true}
        />
      )
      act(() => {
        fireEvent.click(getByText('Commit item'))
      })
      expect(propDataStoreMock.commitItem).toHaveBeenCalledWith(['/', 2])
    })
  })
})

export {}