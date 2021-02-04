import { render } from "@testing-library/react";
import React from "react";
import ValidationSummary from "./ValidationSummary";
import { NodeValidationProvider } from "../node-validation-provider";
import NodeDataProvider from "../node-data-provider";
import { when } from "jest-when";


describe('<ValidationSummary />', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  it('should render error messages', () => {
    const config = {
      id: 'page',
      type: 'object'
    }
    const useTreePathsHookMock = jest.fn()
    when(useTreePathsHookMock)
      .calledWith(config, [ 'page' ])
      .mockReturnValueOnce([ [ 'page' ], [ 'page', '0' ] ])
    const aggregateNodeValidationMock = jest.fn()
    when(aggregateNodeValidationMock)
      .calledWith([ [ 'page' ], [ 'page', '0' ] ])
      .mockReturnValueOnce([
        {
          results: [
            {errorMessage: 'This is an error'},
            {errorMessage: 'This is another error'},
            {errorMessage: 'This is yet another error'},
          ],
          path: ['page', '0']
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
          aggregateNodeValidationHook={aggregateNodeValidationMock}
          validatorRegistry={[]}
        >
          <ValidationSummary config={config} path={[ 'page' ]}/>
        </NodeValidationProvider>
      </NodeDataProvider>
    )
    expect(queryByText('page/0: This is an error')).not.toBeNull()
    expect(queryByText('page/0: This is another error')).not.toBeNull()
    expect(queryByText('page/0: This is yet another error')).not.toBeNull()
  })
  it('should return null when no validation results are found', () => {
    const aggregateValidationDataMock = jest.fn().mockReturnValueOnce([])
    const config = {
      id: 'page',
      type: 'object'
    }
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
          <ValidationSummary config={config} path={[ 'page' ]}/>
        </NodeValidationProvider>
      </NodeDataProvider>
    )
    expect(container.childElementCount).toBe(0)
  })
})

export {}