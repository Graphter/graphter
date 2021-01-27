import stringify from "fast-json-stable-stringify";
import { NodeConfig } from "@graphter/core";
import { Branch } from "./Branch";
import { nodeRendererStore } from "@graphter/renderer-react";

export const getMatchingConfig = (config: NodeConfig, targetNodeData: any) => {
 const matchingBranch = config.options.branches.find((branch: Branch) => typeof branch.condition === 'function' ?
   branch.condition(targetNodeData) :
   stringify(targetNodeData) === stringify(branch.condition))
 if(!matchingBranch) return null
 const matchingChildConfig = config.children?.find(childConfig => childConfig.id === matchingBranch.childId)
 if(!matchingChildConfig) throw new Error(`Matching branch child ID '${matchingBranch.childId}' does not match a child config`)
 return matchingChildConfig
}