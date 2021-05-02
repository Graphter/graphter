import { RecoilRoot } from "recoil";
import React, { ReactNode } from "react";
import { NodeValidatorRegistration } from "@graphter/core";
import { useRecoilNodeData } from "./data/useRecoilNodeData";
import { useRecoilTreeDataCallback } from "./data/useRecoilTreeDataCallback";
import { StateProvider, NodeValidationProvider } from "@graphter/renderer-react";
import { useRecoilTreeData } from "./data/useRecoilTreeData";
import { useRecoilTreeDataInitialiser } from "./data/useRecoilTreeDataInitialiser";
import { useRecoilNodeConfigs } from "./data/useRecoilNodeConfigs";

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
        validatorRegistry={validatorRegistry}
      >
        <StateProvider
          treeDataInitialiserHook={useRecoilTreeDataInitialiser}
          treeDataHook={useRecoilTreeData}
          nodeDataHook={useRecoilNodeData}
          treeDataCallbackHook={useRecoilTreeDataCallback}
          nodeConfigsHook={useRecoilNodeConfigs}
        >
          {children}
        </StateProvider>
      </NodeValidationProvider>
    </RecoilRoot>
  )
}

export default RecoilStateProvider