import { render } from "@testing-library/react";
import RecoilStateProvider from "./RecoilStateProvider";
import React from "react";
import { StateProvider, NodeValidationProvider } from "@graphter/renderer-react";
import { useRecoilAggregateNodeValidation } from "./validation/useRecoilAggregateNodeValidation";
import { useRecoilNodeValidation } from "./validation/useRecoilNodeValidation";
import { NodeValidatorRegistration } from "@graphter/core";
import { useRecoilTreeDataInitialiser } from "./data/useRecoilTreeDataInitialiser";
import { useRecoilNodeData } from "./data/useRecoilNodeData";
import { useRecoilTreeData } from "./data/useRecoilTreeData";
import { useRecoilTreeDataCallback } from "./data/useRecoilTreeDataCallback";
import { useRecoilTreePaths } from "./data/useRecoilTreePaths";
import { useRecoilArrayNodeData } from "./data/useRecoilArrayNodeData";

const NodeValidationProviderMock = NodeValidationProvider as jest.Mock<any>
const StateProviderMock = StateProvider as jest.Mock<any>

describe('<RecoilStateProvider />', () => {
  it('should correctly set up Recoil state management', () => {
    const validatorRegistry: Array<NodeValidatorRegistration> = []
    const { container } = render(
      <RecoilStateProvider validatorRegistry={validatorRegistry}>
        <div>Some child</div>
      </RecoilStateProvider>
    )
    expect(container).toMatchSnapshot()
    expect(NodeValidationProviderMock).toHaveBeenCalled()
    const nodeValidationProviderProps = NodeValidationProviderMock.mock.calls[0][0]
    expect(nodeValidationProviderProps.instanceId).toBe('some-id')
    expect(nodeValidationProviderProps.nodeValidationHook).toBe(useRecoilNodeValidation)
    expect(nodeValidationProviderProps.aggregateNodeValidationHook).toBe(useRecoilAggregateNodeValidation)
    expect(nodeValidationProviderProps.validatorRegistry).toBe(validatorRegistry)
    expect(Object.keys(nodeValidationProviderProps)).toMatchSnapshot()
    expect(StateProviderMock).toHaveBeenCalled()
    const stateProviderProps = StateProviderMock.mock.calls[0][0]
    expect(stateProviderProps.instanceId).toBe('some-id')
    expect(stateProviderProps.treeDataInitialiserHook).toBe(useRecoilTreeDataInitialiser)
    expect(stateProviderProps.nodeDataHook).toBe(useRecoilNodeData)
    expect(stateProviderProps.treeDataHook).toBe(useRecoilTreeData)
    expect(stateProviderProps.treeDataCallbackHook).toBe(useRecoilTreeDataCallback)
    expect(stateProviderProps.treePathsHook).toBe(useRecoilTreePaths)
    expect(stateProviderProps.arrayNodeDataHook).toBe(useRecoilArrayNodeData)
    expect(Object.keys(stateProviderProps)).toMatchSnapshot()

  })
})
export {}