import { render } from "@testing-library/react";
import React from "react";
import ValidationSummary from "./ValidationSummary";
import { NodeValidationProvider } from "../node-validation-provider";
import NodeDataProvider from "../node-data-provider";
import { when } from "jest-when";


describe('<ValidationSummary />', () => {
  it('should render error messages', () => {
    const useTreePathsHookMock = jest.fn()
    when(useTreePathsHookMock)
      .calledWith([ 'page' ])
      .mockReturnValueOnce([ [ 'page' ], [ 'page', '0' ] ])
    const aggregateValidationDataMock = jest.fn()
    when(aggregateValidationDataMock)
      .calledWith([ [ 'page' ], [ 'page', '0' ] ])
      .mockReturnValueOnce([
        {
          results: [
            {errorMessage: 'This is an error'},
            {errorMessage: 'This is another error'},
            {errorMessage: 'This is yet another error'},
          ]
        }
      ])
    const {queryByText} = render(
      <NodeDataProvider
        instanceId={'some-id'}
        nodeDataHook={jest.fn()}
        arrayNodeDataHook={jest.fn()}
        treeDataHook={jest.fn()}
        treePathsHook={useTreePathsHookMock}
      >
        <NodeValidationProvider
          instanceId={'some-id'}
          nodeValidationHook={jest.fn()}
          aggregateNodeValidationHook={aggregateValidationDataMock}
          validatorRegistry={[]}
        >
          <ValidationSummary path={[ 'page' ]}/>
        </NodeValidationProvider>
      </NodeDataProvider>
    )
    expect(queryByText('This is an error')).not.toBeNull()
    expect(queryByText('This is another error')).not.toBeNull()
    expect(queryByText('This is yet another error')).not.toBeNull()
  })
  it('should return null when no validation results are found', () => {
    const aggregateValidationDataMock = jest.fn().mockReturnValueOnce([])
    const { container } = render(
      <NodeDataProvider
        instanceId={'some-id'}
        nodeDataHook={jest.fn()}
        arrayNodeDataHook={jest.fn()}
        treeDataHook={jest.fn()}
        treePathsHook={jest.fn()}
      >
        <NodeValidationProvider
          instanceId={'some-id'}
          nodeValidationHook={jest.fn()}
          aggregateNodeValidationHook={aggregateValidationDataMock}
          validatorRegistry={[]}
        >
          <ValidationSummary path={[ 'page' ]}/>
        </NodeValidationProvider>
      </NodeDataProvider>
    )
    expect(container.childElementCount).toBe(0)
  })
})

export {}