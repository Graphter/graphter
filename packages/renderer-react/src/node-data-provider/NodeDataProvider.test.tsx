import React from 'react';
import { render } from '@testing-library/react';

import NodeDataProvider, { useNodeData, useArrayNodeData } from './NodeDataProvider'

function MockDataConsumer(props: any) {
  useNodeData(
    props.path,
    props.config,
    props.originalNodeData,
    props.committed
  )
  return null
}
function MockArrayDataConsumer<D>(props: any) {
  useArrayNodeData(
    props.path,
    props.config,
    props.originalChildData,
    props.committed
  )
  return null
}

describe('<NodeDataProvider />', () => {

  it('should render children', () => {
    const { queryByTestId } = render(
      <NodeDataProvider
        instanceId={'some-instance-id'}
        nodeDataHook={jest.fn()}
        arrayNodeDataHook={jest.fn()} >
        <div data-testid='some-child-component'>Some child component</div>
      </NodeDataProvider>
    )
    expect(queryByTestId('some-child-component')).not.toBeNull();
  })

  describe('when using useNodeData', () => {
    it('should use the hook supplied to the provider to retrieve data', () => {
      const nodeDataHookMock = jest.fn().mockReturnValue([ ])
      render(
        <NodeDataProvider
          instanceId={'some-instance-id'}
          nodeDataHook={nodeDataHookMock}
          arrayNodeDataHook={jest.fn()} >
          <MockDataConsumer
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
          <MockDataConsumer
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
            arrayNodeDataHook={jest.fn()} >
            <MockDataConsumer
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
  describe('useArrayNodeData', () => {
    it('should use the hook supplied to the provider to retrieve data', () => {
      const arrayNodeDataHookMock = jest.fn().mockReturnValue({})
      render(
        <NodeDataProvider
          instanceId={'some-instance-id'}
          nodeDataHook={jest.fn()}
          arrayNodeDataHook={arrayNodeDataHookMock} >
          <MockArrayDataConsumer
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
          <MockArrayDataConsumer
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
            // @ts-ignore
            arrayNodeDataHook={null} >
            <MockArrayDataConsumer
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
            arrayNodeDataHook={jest.fn()} >
            <MockArrayDataConsumer
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
})
export {}