import React from 'react';
import { render } from '@testing-library/react';

import NodeDataProvider, { useNodeData, useArrayNodeData, useTreeData, useTreePaths } from './NodeDataProvider'


describe('<NodeDataProvider />', () => {

  it('should render children', () => {
    const { queryByTestId } = render(
      <NodeDataProvider
        instanceId={'some-instance-id'}
        nodeDataHook={jest.fn()}
        treeDataHook={jest.fn()}
        treePathsHook={jest.fn()}
        arrayNodeDataHook={jest.fn()} >
        <div data-testid='some-child-component'>Some child component</div>
      </NodeDataProvider>
    )
    expect(queryByTestId('some-child-component')).not.toBeNull();
  })

  describe('when using useNodeData', () => {
    function DataConsumerMock(props: any) {
      useNodeData(
        props.path,
        props.config,
        props.originalNodeData,
        props.committed
      )
      return null
    }
    it('should use the hook supplied to the provider to retrieve node data', () => {
      const nodeDataHookMock = jest.fn().mockReturnValue([ ])
      render(
        <NodeDataProvider
          instanceId={'some-instance-id'}
          nodeDataHook={nodeDataHookMock}
          treeDataHook={jest.fn()}
          treePathsHook={jest.fn()}
          arrayNodeDataHook={jest.fn()} >
          <DataConsumerMock
            path={['/']}
            config={{
              id: 'name',
              type: 'string'
            }}
            originalNodeData='The Name'
            committed={true}
          />
        </NodeDataProvider>
      )
      expect(nodeDataHookMock).toHaveBeenCalledWith(
        ['/'],
        {
          id: 'name',
          type: 'string'
        },
        'The Name',
        true
      )
    })
    it('should error if no provider is defined', () => {
      expect.assertions(1)
      try {
        render(
          <DataConsumerMock
            path={['/']}
            config={{
              id: 'name',
              type: 'string'
            }}
            originalNodeData='The Name'
            committed={true}
          />
        )
      } catch(err) {
        expect(err.message).toMatchSnapshot()
      }
    })
    it('should error if no hook is supplied to the provider', () => {
      expect.assertions(1)
      try {
        render(
          <NodeDataProvider
            instanceId={'some-instance-id'}
            // @ts-ignore
            nodeDataHook={null}
            treeDataHook={jest.fn()}
            treePathsHook={jest.fn()}
            arrayNodeDataHook={jest.fn()} >
            <DataConsumerMock
              path={['/']}
              config={{
                id: 'name',
                type: 'string'
              }}
              originalNodeData='The Name'
              committed={true}
            />
          </NodeDataProvider>
        )
      } catch(err) {
        expect(err.message).toMatchSnapshot()
      }
    })
  })

  describe('when using useArrayNodeData', () => {
    function ArrayDataConsumerMock<D>(props: any) {
      useArrayNodeData(
        props.path,
        props.config,
        props.originalChildData,
        props.committed
      )
      return null
    }
    it('should use the hook supplied to the provider to retrieve array data', () => {
      const arrayNodeDataHookMock = jest.fn().mockReturnValue({})
      render(
        <NodeDataProvider
          instanceId={'some-instance-id'}
          nodeDataHook={jest.fn()}
          treeDataHook={jest.fn()}
          treePathsHook={jest.fn()}
          arrayNodeDataHook={arrayNodeDataHookMock} >
          <ArrayDataConsumerMock
            path={['/']}
            config={{
              id: 'tags',
              type: 'list'
            }}
            originalChildData={[ 'tagA', 'tagB' ]}
            committed={true}
          />
        </NodeDataProvider>
      )
      expect(arrayNodeDataHookMock).toHaveBeenCalledWith(
        ['/'],
        {
          id: 'tags',
          type: 'list'
        },
        [ 'tagA', 'tagB' ],
        true
      )
    })
    it('should error if no provider is defined', () => {
      expect.assertions(1)
      try {
        render(
          <ArrayDataConsumerMock
            path={['/']}
            config={{
              id: 'tags',
              type: 'list'
            }}
            originalChildData={[ 'tagA', 'tagB' ]}
            committed={true}
          />
        )
      } catch(err) {
        expect(err.message).toMatchSnapshot()
      }
    })
    it('should error if no hook is supplied to the provider', () => {
      expect.assertions(1)
      try {
        render(
          <NodeDataProvider
            instanceId={'some-instance-id'}
            nodeDataHook={jest.fn()}
            treeDataHook={jest.fn()}
            treePathsHook={jest.fn()}
            // @ts-ignore
            arrayNodeDataHook={null} >
            <ArrayDataConsumerMock
              path={['/']}
              config={{
                id: 'tags',
                type: 'list'
              }}
              originalChildData={[ 'tagA', 'tagB' ]}
              committed={true}
            />
          </NodeDataProvider>
        )
      } catch(err) {
        expect(err.message).toMatchSnapshot()
      }
    })
    it('should error if original data is not an array', () => {
      expect.assertions(1)
      try {
        render(
          <NodeDataProvider
            instanceId={'some-instance-id'}
            nodeDataHook={jest.fn()}
            treeDataHook={jest.fn()}
            treePathsHook={jest.fn()}
            arrayNodeDataHook={jest.fn()} >
            <ArrayDataConsumerMock
              path={['/']}
              config={{
                id: 'tags',
                type: 'list'
              }}
              originalChildData={'string data'}
              committed={true}
            />
          </NodeDataProvider>
        )
      } catch(err) {
        expect(err.message).toMatchSnapshot()
      }
    })
  })

  describe('when using useTreeData', () => {
    function TreeDataConsumerMock(props: any) {
      useTreeData(
        props.fn,
        props.path,
      )
      return null
    }
    it('should use the hook supplied to the provider to retrieve tree data', () => {
      const treeDataHookMock = jest.fn().mockReturnValue([ ])
      const callbackFn = () => {}
      render(
        <NodeDataProvider
          instanceId={'some-instance-id'}
          nodeDataHook={jest.fn()}
          treeDataHook={treeDataHookMock}
          treePathsHook={jest.fn()}
          arrayNodeDataHook={jest.fn()} >
          <TreeDataConsumerMock
            path={['/']}
            fn={callbackFn}
          />
        </NodeDataProvider>
      )
      expect(treeDataHookMock).toHaveBeenCalledWith(
        callbackFn,
        ['/']
      )
    })
    it('should error if no provider is defined', () => {
      expect.assertions(1)
      try {
        render(
          <TreeDataConsumerMock
            path={['/']}
            config={{
              id: 'name',
              type: 'string'
            }}
            originalNodeData='The Name'
            committed={true}
          />
        )
      } catch(err) {
        expect(err.message).toMatchSnapshot()
      }
    })
    it('should error if no hook is supplied to the provider', () => {
      expect.assertions(1)
      try {
        render(
          <NodeDataProvider
            instanceId={'some-instance-id'}
            nodeDataHook={jest.fn()}
            // @ts-ignore
            treeDataHook={null}
            treePathsHook={jest.fn()}
            arrayNodeDataHook={jest.fn()} >
            <TreeDataConsumerMock
              path={['/']}
              config={{
                id: 'name',
                type: 'string'
              }}
              originalNodeData='The Name'
              committed={true}
            />
          </NodeDataProvider>
        )
      } catch(err) {
        expect(err.message).toMatchSnapshot()
      }
    })
  })

  describe('when using useTreePaths', () => {
    function TreePathsConsumerMock(props: any) {
    useTreePaths(
      props.path,
    )
    return null
  }
    it('should use the hook supplied to the provider to retrieve tree data', () => {
      const treePathsHookMock = jest.fn().mockReturnValue([ ])
      render(
        <NodeDataProvider
          instanceId={'some-instance-id'}
          nodeDataHook={jest.fn()}
          treeDataHook={jest.fn()}
          treePathsHook={treePathsHookMock}
          arrayNodeDataHook={jest.fn()} >
          <TreePathsConsumerMock
            path={['/']}
          />
        </NodeDataProvider>
      )
      expect(treePathsHookMock).toHaveBeenCalledWith(
        ['/']
      )
    })
    it('should error if no provider is defined', () => {
      expect.assertions(1)
      try {
        render(
          <TreePathsConsumerMock
            path={['/']}
            config={{
              id: 'name',
              type: 'string'
            }}
            originalNodeData='The Name'
            committed={true}
          />
        )
      } catch(err) {
        expect(err.message).toMatchSnapshot()
      }
    })
    it('should error if no hook is supplied to the provider', () => {
      expect.assertions(1)
      try {
        render(
          <NodeDataProvider
            instanceId={'some-instance-id'}
            nodeDataHook={jest.fn()}
            treeDataHook={jest.fn()}
            // @ts-ignore
            treePathsHook={null}
            arrayNodeDataHook={jest.fn()} >
            <TreePathsConsumerMock
              path={['/']}
              config={{
                id: 'name',
                type: 'string'
              }}
              originalNodeData='The Name'
              committed={true}
            />
          </NodeDataProvider>
        )
      } catch(err) {
        expect(err.message).toMatchSnapshot()
      }
    })
  })

})
export {}