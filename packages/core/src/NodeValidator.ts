import { ValidationExecutionStage } from "./ValidationExecutionStage";
import { NodeConfig } from "./NodeConfig";
import { PathSegment, ValidationResult } from ".";

export interface NodeValidator {
  (
    stage: ValidationExecutionStage,
    config: NodeConfig,
    path: Array<PathSegment>,
    data: any
  ): Promise<ValidationResult>
}