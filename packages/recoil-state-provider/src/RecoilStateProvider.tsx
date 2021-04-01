import { RecoilRoot } from "recoil";
import React, { ReactNode } from "react";
import { NodeValidatorRegistration } from "@graphter/core";
import { useRecoilNodeValidation } from "./validation/useRecoilNodeValidation";
import { useRecoilAggregateNodeValidation } from "./validation/useRecoilAggregateNodeValidation";
import { useRecoilNodeData } from "./data/useRecoilNodeData";
import { useRecoilMultipleNodeData } from "./data/useRecoilMultipleNodeData";
import { useRecoilTreeDataCallback } from "./data/useRecoilTreeDataCallback";
import { useRecoilTreePaths } from "./data/useRecoilTreePaths";
import { StateProvider, NodeValidationProvider } from "@graphter/renderer-react";
import { useRecoilTreeDataInitialiser } from "./data/useRecoilTreeDataInitialiser";
import { useRecoilTreeData } from "./data/useRecoilTreeData";

export interface RecoilStateProvider {
  validatorRegistry: Array<NodeValidatorRegistration>
  children?: ReactNode
}

export function RecoilStateProvider(
  {
    validatorRegistry,
    children
  }: RecoilStateProvider
) {
  return (
    <RecoilRoot>
      <NodeValidationProvider
        nodeValidationHook={useRecoilNodeValidation}
        aggregateNodeValidationHook={useRecoilAggregateNodeValidation}
        validatorRegistry={validatorRegistry}
      >
        <StateProvider
          treeDataHook={useRecoilTreeData}
          treeDataInitialiserHook={useRecoilTreeDataInitialiser}
          nodeDataHook={useRecoilNodeData}
          multipleNodeDataHook={useRecoilMultipleNodeData}
          treeDataCallbackHook={useRecoilTreeDataCallback}
          treePathsHook={useRecoilTreePaths}
        >
          {children}
        </StateProvider>
      </NodeValidationProvider>
    </RecoilRoot>
  )
}

export default RecoilStateProvider