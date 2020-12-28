import { NodeValidatorRegistration, PathSegment } from "@graphter/core";
import { NodeValidationData } from "./NodeValidationData";

export interface NodeValidationHook {
  (
    path: Array<PathSegment>,
    validatorRegistry: Array<NodeValidatorRegistration>
  ): NodeValidationData
}