import { render } from '@testing-library/react';

import StateProvider,
{
  useNodeData,
  useTreeDataInitialiser,
  useArrayNodeData,
  useTreeData,
  useTreePaths,
  useTreeDataCallback
} from './StateProvider'
import * as React from "react";


describe('<StateProvider />', () => {

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render children', () => {
    const { queryByText } = render(
      <StateProvider
        nodeDataHook={jest.fn()}
        treeDataInitialiserHook={jest.fn()}
        treeDataHook={jest.fn()}
        multipleNodeDataHook={jest.fn()}
        treeDataCallbackHook={jest.fn()}
        treePathsHook={jest.fn()}
        arrayNodeDataHook={jest.fn()} >
        <div>Some child component</div>
      </StateProvider>
    )
    expect(queryByText('Some child component')).not.toBeNull();
  })

  describe('when using useTreeDataInitialiser', () => {
    function TreeDataConsumerMock(props: any) {
      const initialiser = useTreeDataInitialiser()
      initialiser(props.config, props.path, props.originalNodeData)
      return null
    }
    it('should use the hook supplied to return an initialiser function', () => {
      const initialiserMock = jest.fn()
      const treeDataInitialiserHookMock = jest.fn().mockReturnValue(initialiserMock)
      render(
        <StateProvider
          nodeDataHook={jest.fn()}
          multipleNodeDataHook={jest.fn()}
          treeDataInitialiserHook={treeDataInitialiserHookMock}
          treeDataHook={jest.fn()}
          treeDataCallbackHook={jest.fn()}
          treePathsHook={jest.fn()}
          arrayNodeDataHook={jest.fn()} >
          <TreeDataConsumerMock
            config={{ id: 'some-id', type: 'some-type' }}
            path={['/']}
            originalNodeData='The original data'
          />
        </StateProvider>
      )
      expect(initialiserMock).toHaveBeenCalledWith(
        { id: 'some-id', type: 'some-type' },
        ['/'],
        'The original data',
      )
    })
    it('should error if no provider is defined', () => {
      expect(() => {
        render(
          <TreeDataConsumerMock
            config={{ id: 'some-id', type: 'some-type' }}
            path={['/']}
            originalNodeData='The Name'
          />
        )
      }).toThrowErrorMatchingSnapshot()
    })
    it('should error if no hook is supplied to the provider', () => {
      expect(() => {
        render(
          <StateProvider
            nodeDataHook={jest.fn()}
            multipleNodeDataHook={jest.fn()}
            // @ts-ignore
            treeDataInitialiserHook={null}
            treeDataHook={jest.fn()}
            treeDataCallbackHook={jest.fn()}
            treePathsHook={jest.fn()}
            arrayNodeDataHook={jest.fn()} >
            <TreeDataConsumerMock
              config={{ id: 'some-id', type: 'some-type' }}
              path={['/']}
              originalNodeData='The Name'
            />
          </StateProvider>
        )
      }).toThrowErrorMatchingSnapshot()
    })
  })

  describe('when using useNodeData', () => {
    function DataConsumerMock(props: any) {
      useNodeData(props.path)
      return null
    }
    it('should use the hook supplied to the provider to retrieve node data', () => {
      const nodeDataHookMock = jest.fn().mockReturnValue([ ])
      render(
        <StateProvider
          nodeDataHook={nodeDataHookMock}
          multipleNodeDataHook={jest.fn()}
          treeDataInitialiserHook={jest.fn()}
          treeDataHook={jest.fn()}
          treeDataCallbackHook={jest.fn()}
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
        </StateProvider>
      )
      expect(nodeDataHookMock).toHaveBeenCalledWith(
        ['/'],
        'The Name',
        true
      )
    })
    it('should error if no provider is defined', () => {
      expect(() => {
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
      }).toThrowErrorMatchingSnapshot()
    })
    it('should error if no hook is supplied to the provider', () => {
      expect(() => {
        render(
          <StateProvider
            // @ts-ignore
            nodeDataHook={null}
            multipleNodeDataHook={jest.fn()}
            treeDataInitialiserHook={jest.fn()}
            treeDataHook={jest.fn()}
            treeDataCallbackHook={jest.fn()}
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
          </StateProvider>
        )
      }).toThrowErrorMatchingSnapshot()
    })
  })

  describe('when using useArrayNodeData', () => {
    function ArrayDataConsumerMock<D>(props: any) {
      useArrayNodeData(
        props.path
      )
      return null
    }
    it('should use the hook supplied to the provider to retrieve array data', () => {
      const arrayNodeDataHookMock = jest.fn().mockReturnValue({})
      render(
        <StateProvider
          nodeDataHook={jest.fn()}
          multipleNodeDataHook={jest.fn()}
          treeDataInitialiserHook={jest.fn()}
          treeDataHook={jest.fn()}
          treeDataCallbackHook={jest.fn()}
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
        </StateProvider>
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
      expect(() => {
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
      }).toThrowErrorMatchingSnapshot()
    })
    it('should error if no hook is supplied to the provider', () => {
      expect(() => {
        render(
          <StateProvider
            nodeDataHook={jest.fn()}
            multipleNodeDataHook={jest.fn()}
            treeDataInitialiserHook={jest.fn()}
            treeDataHook={jest.fn()}
            treeDataCallbackHook={jest.fn()}
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
          </StateProvider>
        )
      }).toThrowErrorMatchingSnapshot()
    })
    it('should error if original data is not an array', () => {
      expect(() => {
        render(
          <StateProvider
            nodeDataHook={jest.fn()}
            multipleNodeDataHook={jest.fn()}
            treeDataInitialiserHook={jest.fn()}
            treeDataHook={jest.fn()}
            treeDataCallbackHook={jest.fn()}
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
          </StateProvider>
        )
      }).toThrowErrorMatchingSnapshot()
    })
  })

  describe('when using treeDataHook', () => {
    function TreeDataConsumerMock(props: any) {
      useTreeData(
        props.config,
        props.path
      )
      return null
    }
    it('should use the hook supplied to the provider to retrieve tree data', () => {
      const treeDataHookMock = jest.fn().mockReturnValue([ ])
      render(
        <StateProvider
          nodeDataHook={jest.fn()}
          multipleNodeDataHook={jest.fn()}
          treeDataInitialiserHook={jest.fn()}
          treeDataHook={treeDataHookMock}
          treeDataCallbackHook={jest.fn()}
          treePathsHook={jest.fn()}
          arrayNodeDataHook={jest.fn()}
        >
          <TreeDataConsumerMock
            path={['/']}
            config={{
              id: 'some-node'
            }}
          />
        </StateProvider>
      )
      expect(treeDataHookMock).toHaveBeenCalledWith(
        {
          id: 'some-node'
        },
        ['/']
      )
    })
    it('should error if no provider is defined', () => {
      expect(() => {
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
      }).toThrowErrorMatchingSnapshot()
    })
    it('should error if no hook is supplied to the provider', () => {
      expect(() => {
        render(
          <StateProvider
            nodeDataHook={jest.fn()}
            multipleNodeDataHook={jest.fn()}
            treeDataInitialiserHook={jest.fn()}
            // @ts-ignore
            treeDataHook={null}
            treeDataCallbackHook={jest.fn()}
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
          </StateProvider>
        )
      }).toThrowErrorMatchingSnapshot()
    })
  })

  describe('when using treeDataCallbackHook', () => {
    function TreeDataCallbackConsumerMock(props: any) {
      useTreeDataCallback(
        props.fn,
        props.config,
        props.path
      )
      return null
    }
    it('should use the hook supplied to the provider to return a callback that retrieves tree data', () => {
      const treeDataCallbackHookMock = jest.fn().mockReturnValue([ ])
      const callbackFn = () => {}
      render(
        <StateProvider
          nodeDataHook={jest.fn()}
          multipleNodeDataHook={jest.fn()}
          treeDataInitialiserHook={jest.fn()}
          treeDataHook={jest.fn()}
          treeDataCallbackHook={treeDataCallbackHookMock}
          treePathsHook={jest.fn()}
          arrayNodeDataHook={jest.fn()}
        >
          <TreeDataCallbackConsumerMock
            path={['/']}
            fn={callbackFn}
            config={{
              id: 'some-node'
            }}
          />
        </StateProvider>
      )
      expect(treeDataCallbackHookMock).toHaveBeenCalledWith(
        callbackFn,
        {
          id: 'some-node'
        },
        ['/']
      )
    })
    it('should error if no provider is defined', () => {
      expect(() => {
        render(
          <TreeDataCallbackConsumerMock
            path={['/']}
            config={{
              id: 'name',
              type: 'string'
            }}
            originalNodeData='The Name'
            committed={true}
          />
        )
      }).toThrowErrorMatchingSnapshot()
    })
    it('should error if no hook is supplied to the provider', () => {
      expect(() => {
        render(
          <StateProvider
            nodeDataHook={jest.fn()}
            multipleNodeDataHook={jest.fn()}
            treeDataInitialiserHook={jest.fn()}
            treeDataHook={jest.fn()}
            // @ts-ignore
            treeDataCallbackHook={null}
            treePathsHook={jest.fn()}
            arrayNodeDataHook={jest.fn()} >
            <TreeDataCallbackConsumerMock
              path={['/']}
              config={{
                id: 'name',
                type: 'string'
              }}
              originalNodeData='The Name'
              committed={true}
            />
          </StateProvider>
        )
      }).toThrowErrorMatchingSnapshot()
    })
  })

  describe('when using useTreePaths', () => {
    function TreePathsConsumerMock(props: any) {
    useTreePaths(
      props.path,
      props.config,
    )
    return null
  }
    it('should use the hook supplied to the provider to retrieve tree data', () => {
      const treePathsHookMock = jest.fn().mockReturnValue([ ])
      render(
        <StateProvider
          nodeDataHook={jest.fn()}
          multipleNodeDataHook={jest.fn()}
          treeDataInitialiserHook={jest.fn()}
          treeDataHook={jest.fn()}
          treeDataCallbackHook={jest.fn()}
          treePathsHook={treePathsHookMock}
          arrayNodeDataHook={jest.fn()} >
          <TreePathsConsumerMock
            config={{
              id: 'some-id'
            }}
            path={['/']}
          />
        </StateProvider>
      )
      expect(treePathsHookMock).toHaveBeenCalledWith(
        ['/'],
        {
          id: 'some-id'
        }
      )
    })
    it('should error if no provider is defined', () => {
      expect(() => {
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
      }).toThrowErrorMatchingSnapshot()
    })
    it('should error if no hook is supplied to the provider', () => {
      expect(() => {
        render(
          <StateProvider
            nodeDataHook={jest.fn()}
            multipleNodeDataHook={jest.fn()}
            treeDataInitialiserHook={jest.fn()}
            treeDataHook={jest.fn()}
            treeDataCallbackHook={jest.fn()}
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
          </StateProvider>
        )
      }).toThrowErrorMatchingSnapshot()
    })
  })

})
export {}