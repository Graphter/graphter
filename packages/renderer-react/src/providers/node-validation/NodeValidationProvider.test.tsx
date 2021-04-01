import React from 'react'
import { NodeValidationProvider, useAggregateNodeValidation, useNodeValidation } from './NodeValidationProvider'
import { render } from "@testing-library/react";

describe('<NodeValidationProvider />', () => {
  it('should render children', () => {
    const { queryByText } = render(
      <NodeValidationProvider
        nodeValidationHook={jest.fn()}
        aggregateNodeValidationHook={jest.fn()}
        validatorRegistry={[]}
      >
        <div>Some child component</div>
      </NodeValidationProvider>
    )
    expect(queryByText('Some child component')).not.toBeNull()
  })
  describe('when using useNodeValidation hook', () => {
    function ValidationConsumerMock(props: any) {
      useNodeValidation(props.config, props.path)
      return null
    }
    it('should delegate to the registered node validation hook', () => {
      const nodeValidationHookMock = jest.fn()
      render(
        <NodeValidationProvider
          nodeValidationHook={nodeValidationHookMock}
          aggregateNodeValidationHook={jest.fn()}
          validatorRegistry={[]}
        >
          <ValidationConsumerMock path={['page']} config={{ id: 'some-id' }} />
        </NodeValidationProvider>
      )
      expect(nodeValidationHookMock).toHaveBeenCalledWith({ id: 'some-id' }, ['page'], [])
    })
    it('should throw an error if the provider is not present in the component hierarchy', () => {
      expect(() => {
        render(<ValidationConsumerMock path={['page']} />)
      }).toThrowErrorMatchingSnapshot()
    })
    it('should throw an error if a node validation hook has not been defined', () => {
      expect(() => {
        render(
          <NodeValidationProvider
            // @ts-ignore
            nodeValidationHook={null}
            aggregateNodeValidationHook={jest.fn()}
            validatorRegistry={[]}
          >
            <ValidationConsumerMock path={['page']} />
          </NodeValidationProvider>
        )
      }).toThrowErrorMatchingSnapshot()
    })
    it('should throw an error if a validator registry is not present', () => {
      expect(() => {
        render(
          <NodeValidationProvider
            nodeValidationHook={jest.fn()}
            aggregateNodeValidationHook={jest.fn()}
            // @ts-ignore
            validatorRegistry={null}
          >
            <ValidationConsumerMock path={['page']} />
          </NodeValidationProvider>
        )
      }).toThrowErrorMatchingSnapshot()
    })
  })
  describe('when using useAggregateNodeValidation', () => {
    function AggregateValidationConsumerMock(props: any) {
      useAggregateNodeValidation(props.paths)
      return null
    }
    it('should delegate to the registered aggregate node validation hook', () => {
      const aggregateNodeValidationHookMock = jest.fn()
      render(
        <NodeValidationProvider
          nodeValidationHook={jest.fn()}
          aggregateNodeValidationHook={aggregateNodeValidationHookMock}
          validatorRegistry={[]}
        >
          <AggregateValidationConsumerMock paths={[['page'], ['page', '0']]} />
        </NodeValidationProvider>
      )
      expect(aggregateNodeValidationHookMock).toHaveBeenCalledWith([['page'], ['page', '0']])
    })
    it('should throw an error if the provider is not present in the component hierarchy', () => {
      expect(() => {
        render(
          <AggregateValidationConsumerMock paths={[['page'], ['page', '0']]} />
        )
      }).toThrowErrorMatchingSnapshot()
    })
    it('should throw an error if an aggregate node validation hook has not been defined', () => {
      expect(() => {
        render(
          <NodeValidationProvider
            nodeValidationHook={jest.fn()}
            // @ts-ignore
            aggregateNodeValidationHook={null}
            validatorRegistry={[]}
          >
            <AggregateValidationConsumerMock paths={[['page'], ['page', '0']]} />
          </NodeValidationProvider>
        )
      }).toThrowErrorMatchingSnapshot()
    })
  })
})
export {}