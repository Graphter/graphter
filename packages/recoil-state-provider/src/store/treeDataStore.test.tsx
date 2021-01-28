import React from 'react'
import {
  RecoilRoot,
  RecoilValueReadOnly,
  selector,
  useRecoilValue,
  useRecoilValueLoadable
} from "recoil";
import { TreeDataStore } from "./treeDataStore";
import { propDataStore } from "./propDataStore";
import { pathConfigStore, nodeRendererStore } from "@graphter/renderer-react";
import { when } from "jest-when";
import { render } from "@testing-library/react";
import flushPromises from "../../test-utils/flushPromises";

const pathConfigStoreMock = pathConfigStore as jest.Mocked<any>
const nodeRendererStoreMock = nodeRendererStore as jest.Mocked<any>

describe('treeDataStore', () => {
  let treeDataStore: TreeDataStore
  beforeEach(async () => {
    jest.isolateModules(async () => {
      treeDataStore = require('./treeDataStore').default
    })
    jest.resetAllMocks()
    nodeRendererStoreMock.get.mockReset()
  })
  describe('getDescendentData()', () => {
    it('should return a selector that resolves the descendent tree structure', () => {
      function ConsumerComponent() {
        const value = useRecoilValue(treeDataStore.getDescendentData([ 'page' ]))
        return <div>{JSON.stringify(value)}</div>
      }

      when(pathConfigStoreMock.get)
        .calledWith([ 'page' ])
        .mockReturnValueOnce({
          id: 'page',
          type: 'unicorn'
        })
      const getChildDataMock = jest.fn()
      when(getChildDataMock)
        .calledWith([ 'page' ], expect.anything())
        .mockReturnValue('the-child-data')
      when(nodeRendererStoreMock.get)
        .calledWith('unicorn')
        .mockReturnValueOnce({
          getChildData: getChildDataMock
        })
      const {container} = render(
        <RecoilRoot>
          <ConsumerComponent/>
        </RecoilRoot>
      )
      expect(container).toMatchSnapshot()
    })
    it('should skip descendent data resolution if the starting node does not implement a getChildData() function', async () => {
      function ConsumerComponent() {
        const loadableValue = useRecoilValueLoadable(treeDataStore.getDescendentData([ 'page' ]))
        return loadableValue.state === 'hasValue' ?
          <div>{loadableValue.contents}</div> :
          null
      }

      when(pathConfigStoreMock.get)
        .calledWith([ 'page' ])
        .mockReturnValueOnce({
          id: 'page',
          type: 'unicorn'
        })
      when(nodeRendererStoreMock.get)
        .calledWith('unicorn')
        .mockReturnValueOnce({})
      propDataStore.set([ 'page' ], true, 'the-page-value')
      const {container} = render(
        <RecoilRoot>
          <ConsumerComponent/>
        </RecoilRoot>
      )
      await flushPromises()
      expect(container).toMatchSnapshot()
    })
    it('should cache the selector for next time', () => {
      let states: Array<RecoilValueReadOnly<any>> = []

      function ConsumerComponent() {
        const state = treeDataStore.getDescendentData([ 'page' ])
        states.push(state)
        return null
      }

      when(pathConfigStoreMock.get)
        .calledWith([ 'page' ])
        .mockReturnValueOnce({
          id: 'page',
          type: 'unicorn'
        })
      const getChildDataMock = jest.fn()
      when(getChildDataMock)
        .calledWith([ 'page' ], expect.anything())
        .mockReturnValue('the-child-data')
      when(nodeRendererStoreMock.get)
        .calledWith('unicorn')
        .mockReturnValueOnce({
          getChildData: getChildDataMock
        })
      render(
        <RecoilRoot>
          <ConsumerComponent/>
          <ConsumerComponent/>
        </RecoilRoot>
      )
      expect(states.length).toBe(2)
      expect(states[0]).toBe(states[1])
    })
    it('should error if config is missing for the starting node', () => {
      function ConsumerComponent() {
        const value = useRecoilValue(treeDataStore.getDescendentData([ 'page' ]))
        return <div>{JSON.stringify(value)}</div>
      }

      expect(() => render(
        <RecoilRoot>
          <ConsumerComponent/>
        </RecoilRoot>
      )).toThrowErrorMatchingSnapshot()
    })
    it('should error if no renderer is found for the starting node', () => {
      function ConsumerComponent() {
        const value = useRecoilValue(treeDataStore.getDescendentData([ 'page' ]))
        return <div>{JSON.stringify(value)}</div>
      }

      when(pathConfigStoreMock.get)
        .calledWith([ 'page' ])
        .mockReturnValueOnce({
          id: 'page',
          type: 'unicorn'
        })
      expect(() => render(
        <RecoilRoot>
          <ConsumerComponent/>
        </RecoilRoot>
      )).toThrowErrorMatchingSnapshot()
    })
  })
  describe('getDescendentPaths', () => {
    beforeEach(async () => {
      jest.resetAllMocks()
    })
    function ConsumerComponent() {
      const pathsLoadable = useRecoilValueLoadable(treeDataStore.getDescendentPaths([ 'page' ]))
      return pathsLoadable.state === 'hasValue' ?
        <div>
          {JSON.stringify( pathsLoadable.contents)}
        </div> : null
    }
    it('should return a selector that resolves the descendent paths', async () => {
      when(pathConfigStoreMock.get)
        .calledWith([ 'page' ])
        .mockReturnValueOnce({
          id: 'page',
          type: 'unicorn'
        })
      const getChildPathsMock = jest.fn()
      when(getChildPathsMock)
        .calledWith([ 'page' ], expect.anything())
        .mockReturnValueOnce( [['page', 'title'], ['page', 'author']])
      when(nodeRendererStoreMock.get)
        .calledWith('unicorn')
        .mockReturnValueOnce({
          getChildPaths: getChildPathsMock
        })
      const {container} = render(
        <RecoilRoot>
          <ConsumerComponent/>
        </RecoilRoot>
      )
      await flushPromises()
      expect(container).toMatchSnapshot()
    })
    it('should skip descendent path resolution if the starting node does not implement a getChildPaths() function', async () => {
      when(pathConfigStoreMock.get)
        .calledWith([ 'page' ])
        .mockReturnValueOnce({
          id: 'page',
          type: 'unicorn'
        })
      when(nodeRendererStoreMock.get)
        .calledWith('unicorn')
        .mockReturnValueOnce({ })
      const {container} = render(
        <RecoilRoot>
          <ConsumerComponent/>
        </RecoilRoot>
      )
      await flushPromises()
      expect(container).toMatchSnapshot()
    })
    it('should cache the selector for next time', async () => {
      const states: Array<any> = []
      function RecordingConsumerComponent() {
        states.push(treeDataStore.getDescendentPaths([ 'page' ]))
        return null
      }
      when(pathConfigStoreMock.get)
        .calledWith([ 'page' ])
        .mockReturnValueOnce({
          id: 'page',
          type: 'unicorn'
        })
      when(nodeRendererStoreMock.get)
        .calledWith('unicorn')
        .mockReturnValueOnce({ })
      render(
        <RecoilRoot>
          <RecordingConsumerComponent/>
          <RecordingConsumerComponent/>
        </RecoilRoot>
      )
      await flushPromises()
      expect(states.length).toBe(2)
      expect(states[0]).toBe(states[1])
    })
    it('should error if config is missing for the starting node', async () => {
      function ErrorConsumerComponent() {
        const pathsLoadable = useRecoilValueLoadable(treeDataStore.getDescendentPaths([ 'page' ]))
        return <div>
            {JSON.stringify(pathsLoadable)}
          </div>
      }
      const { container } = render(
        <RecoilRoot>
          <ErrorConsumerComponent/>
        </RecoilRoot>
      )
      await flushPromises()
      expect(container).toMatchSnapshot()
    })
    it('should error if no renderer is found for the starting node', async () => {
      function ErrorConsumerComponent() {
        const pathsLoadable = useRecoilValueLoadable(treeDataStore.getDescendentPaths([ 'page' ]))
        return <div>
          {JSON.stringify(pathsLoadable)}
        </div>
      }
      when(pathConfigStoreMock.get)
        .calledWith([ 'page' ])
        .mockReturnValueOnce({
          id: 'page',
          type: 'unicorn'
        })
      const { container } = render(
        <RecoilRoot>
          <ErrorConsumerComponent/>
        </RecoilRoot>
      )
      await flushPromises()
      expect(container).toMatchSnapshot()
    })
  })
})
export {}