import { PathSegment, ValidationResult } from "@graphter/core";

export interface NodeValidationData {
  path: Array<PathSegment>
  value?: any
  results: Array<ValidationResult>
}