import { NodeConfig, NodeValidatorRegistration, PathSegment } from "@graphter/core";
import { NodeValidationData } from "./NodeValidationData";

export interface NodeValidationHook {
  (
    config: NodeConfig,
    path: Array<PathSegment>,
    validatorRegistry: Array<NodeValidatorRegistration>
  ): NodeValidationData
}