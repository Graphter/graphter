import { RecoilRoot } from "recoil";
import React, { ReactNode } from "react";
import { NodeValidatorRegistration } from "@graphter/core";
import { useRecoilNodeValidation } from "./validation/useRecoilNodeValidation";
import { useRecoilAggregateNodeValidation } from "./validation/useRecoilAggregateNodeValidation";
import { useRecoilNodeData } from "./data/useRecoilNodeData";
import { useRecoilTreeData } from "./data/useRecoilTreeData";
import { useRecoilTreePaths } from "./data/useRecoilTreePaths";
import { useRecoilArrayNodeData } from "./data/useRecoilArrayNodeData";
import { NodeDataProvider, NodeValidationProvider } from "@graphter/renderer-react";

export interface RecoilStateProvider {
  instanceId: string | number
  validatorRegistry: Array<NodeValidatorRegistration>
  children?: ReactNode
}

export function RecoilStateProvider(
  {
    instanceId,
    validatorRegistry,
    children
  }: RecoilStateProvider
) {
  return (
    <RecoilRoot>
      <NodeValidationProvider
        instanceId={instanceId}
        nodeValidationHook={useRecoilNodeValidation}
        aggregateNodeValidationHook={useRecoilAggregateNodeValidation}
        validatorRegistry={validatorRegistry}
      >
        <NodeDataProvider
          instanceId={instanceId}
          nodeDataHook={useRecoilNodeData}
          treeDataHook={useRecoilTreeData}
          treePathsHook={useRecoilTreePaths}
          arrayNodeDataHook={useRecoilArrayNodeData}
        >
          {children}
        </NodeDataProvider>
      </NodeValidationProvider>
    </RecoilRoot>
  )
}

export default RecoilStateProvider