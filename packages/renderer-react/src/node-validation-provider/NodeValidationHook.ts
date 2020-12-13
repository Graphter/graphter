import { NodeValidatorRegistration, PathSegment, ValidationResult } from "@graphter/core";

export interface NodeValidationHook {
  (
    path: Array<PathSegment>,
    validatorRegistry: Array<NodeValidatorRegistration>
  ): Array<ValidationResult>
}