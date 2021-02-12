import { render } from "@testing-library/react";
import ValidationSummary from "./ValidationSummary";
import { NodeValidationProvider } from "../providers/node-validation";
import NodeDataProvider from "../providers/node-data";
import { when } from "jest-when";
import React from "react";


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
        treeDataInitialiserHook={jest.fn()}
        nodeDataHook={jest.fn()}
        arrayNodeDataHook={jest.fn()}
        treeDataHook={jest.fn()}
        treeDataCallbackHook={jest.fn()}
        treePathsHook={useTreePathsHookMock}
      >
        <NodeValidationProvider
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
        treeDataInitialiserHook={jest.fn()}
        nodeDataHook={jest.fn()}
        arrayNodeDataHook={jest.fn()}
        treeDataHook={jest.fn()}
        treeDataCallbackHook={jest.fn()}
        treePathsHook={jest.fn()}
      >
        <NodeValidationProvider
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