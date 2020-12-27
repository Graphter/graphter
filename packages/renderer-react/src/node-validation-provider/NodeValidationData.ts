import { NodeConfig, PathSegment, ValidationResult } from "@graphter/core";

export interface NodeValidationData {
  path: Array<PathSegment>
  config?: NodeConfig
  value?: any
  results: Array<ValidationResult>
}