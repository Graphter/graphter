import stringify from "fast-json-stable-stringify";
import { ConditionalNodeBranch, ConditionalNodeConfig } from "./ConditionalNodeConfig";

export const getMatchingConfig = (config: ConditionalNodeConfig, targetNodeData: any) => {
 const matchingBranch = config.options.branches.find((branch: ConditionalNodeBranch) => typeof branch.condition === 'function' ?
   branch.condition(targetNodeData) :
   stringify(targetNodeData) === stringify(branch.condition))
 if(!matchingBranch) return null
 const matchingChildConfig = config.children?.find(childConfig => childConfig.id === matchingBranch.childId)
 if(!matchingChildConfig) throw new Error(`Matching branch child ID '${matchingBranch.childId}' does not match a child config`)
 return matchingChildConfig
}