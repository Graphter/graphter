import React from 'react'
import {
  RecoilRoot,
  RecoilValueReadOnly,
  useRecoilValue,
} from "recoil";
import { TreeDataStore } from "./treeDataStore";
import { propDataStore } from "./propDataStore";
import { nodeRendererStore } from "@graphter/renderer-react";
import { when } from "jest-when";
import { render } from "@testing-library/react";
import { NodeConfig } from "@graphter/core";

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
      function ConsumerComponent({config}: { config: NodeConfig }) {
        const value = useRecoilValue(treeDataStore.getBranchData(config, [ 'page' ]))
        return <div>{JSON.stringify(value)}</div>
      }
      const config = {
        id: 'page',
        type: 'unicorn'
      }
      const getChildDataMock = jest.fn()
      when(getChildDataMock)
        .calledWith(config, [ 'page' ], expect.anything())
        .mockReturnValue('the-child-data')
      when(nodeRendererStoreMock.get)
        .calledWith('unicorn')
        .mockReturnValueOnce({
          getChildData: getChildDataMock
        })
      const {container} = render(
        <RecoilRoot>
          <ConsumerComponent config={config}/>
        </RecoilRoot>
      )
      expect(container).toMatchSnapshot()
    })
    it('should skip descendent data resolution if the starting node does not implement a getChildData() function', async () => {
      function ConsumerComponent({config}: { config: NodeConfig }) {
        const value = useRecoilValue(treeDataStore.getBranchData(config, [ 'page' ]))
        return <div>{value}</div>
      }

      const config = {
        id: 'page',
        type: 'unicorn'
      }
      when(nodeRendererStoreMock.get)
        .calledWith('unicorn')
        .mockReturnValueOnce({})
      propDataStore.set([ 'page' ], 'the-page-value')
      const {container} = render(
        <RecoilRoot>
          <ConsumerComponent config={config}/>
        </RecoilRoot>
      )
      expect(container).toMatchSnapshot()
    })
    it('should cache the selector for next time', () => {
      let states: Array<RecoilValueReadOnly<any>> = []

      function ConsumerComponent({config}: { config: NodeConfig }) {
        const state = treeDataStore.getBranchData(config, [ 'page' ])
        states.push(state)
        return null
      }

      const config = {
        id: 'page',
        type: 'unicorn'
      }
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
          <ConsumerComponent config={config}/>
          <ConsumerComponent config={config}/>
        </RecoilRoot>
      )
      expect(states.length).toBe(2)
      expect(states[0]).toBe(states[1])
    })
    it.each([ null, undefined ])('should error if %o config is passed to the starting node', (noConfig) => {
      function ConsumerComponent({config}: { config: NodeConfig }) {
        const value = useRecoilValue(treeDataStore.getBranchData(config, [ 'page' ]))
        return <div>{JSON.stringify(value)}</div>
      }

      expect(() => render(
        <RecoilRoot>
          <ConsumerComponent
            // @ts-ignore
            config={noConfig}/>
        </RecoilRoot>
      )).toThrowErrorMatchingSnapshot()
    })
    it('should error if no renderer is found for the starting node', () => {
      function ConsumerComponent({config}: { config: NodeConfig }) {
        const value = useRecoilValue(treeDataStore.getBranchData(config, [ 'page' ]))
        return <div>{JSON.stringify(value)}</div>
      }

      const config = {
        id: 'page',
        type: 'unicorn'
      }
      expect(() => render(
        <RecoilRoot>
          <ConsumerComponent config={config}/>
        </RecoilRoot>
      )).toThrowErrorMatchingSnapshot()
    })
  })
  describe('getDescendentPaths', () => {
    beforeEach(async () => {
      jest.resetAllMocks()
    })

    function ConsumerComponent({config}: { config: NodeConfig }) {
      const value = useRecoilValue(treeDataStore.getBranchPaths(config, [ 'page' ]))
      return (
        <div>
          {JSON.stringify(value)}
        </div>
      )
    }

    it('should return a selector that resolves the descendent paths', async () => {
      const config = {
        id: 'page',
        type: 'unicorn'
      }
      const getChildPathsMock = jest.fn()
      when(getChildPathsMock)
        .calledWith(config, [ 'page' ], expect.anything())
        .mockReturnValueOnce([ [ 'page', 'title' ], [ 'page', 'author' ] ])
      when(nodeRendererStoreMock.get)
        .calledWith('unicorn')
        .mockReturnValueOnce({
          getChildPaths: getChildPathsMock
        })
      const {container} = render(
        <RecoilRoot>
          <ConsumerComponent config={config}/>
        </RecoilRoot>
      )
      expect(container).toMatchSnapshot()
    })
    it('should skip descendent path resolution if the starting node does not implement a getChildPaths() function', async () => {
      const config = {
        id: 'page',
        type: 'unicorn'
      }
      when(nodeRendererStoreMock.get)
        .calledWith('unicorn')
        .mockReturnValueOnce({})
      const {container} = render(
        <RecoilRoot>
          <ConsumerComponent config={config}/>
        </RecoilRoot>
      )
      expect(container).toMatchSnapshot()
    })
    it('should cache the selector for next time', async () => {
      const states: Array<any> = []

      function RecordingConsumerComponent({config}: { config: NodeConfig }) {
        states.push(treeDataStore.getBranchPaths(config, [ 'page' ]))
        return null
      }

      const config = {
        id: 'page',
        type: 'unicorn'
      }
      when(nodeRendererStoreMock.get)
        .calledWith('unicorn')
        .mockReturnValueOnce({})
      render(
        <RecoilRoot>
          <RecordingConsumerComponent config={config}/>
          <RecordingConsumerComponent config={config}/>
        </RecoilRoot>
      )
      expect(states.length).toBe(2)
      expect(states[0]).toBe(states[1])
    })
    it.each([ null, undefined ])
    ('should error if %o config is passed to the starting node', async (noConfig) => {
      function ErrorConsumerComponent({config}: { config: NodeConfig }) {
        useRecoilValue(treeDataStore.getBranchPaths(config, [ 'page' ]))
        return null
      }

      expect(() => render(
        <RecoilRoot>
          <ErrorConsumerComponent
            // @ts-ignore
            config={noConfig}/>
        </RecoilRoot>
      )).toThrowErrorMatchingSnapshot()
    })
    it('should error if no renderer is found for the starting node', async () => {
      function ErrorConsumerComponent({config}: { config: NodeConfig }) {
        useRecoilValue(treeDataStore.getBranchPaths(config, [ 'page' ]))
        return null
      }

      const config = {
        id: 'page',
        type: 'unicorn'
      }
      expect(() => render(
        <RecoilRoot>
          <ErrorConsumerComponent config={config}/>
        </RecoilRoot>
      )).toThrowErrorMatchingSnapshot()
    })
  })
})
export {}