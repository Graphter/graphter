import { ValidationExecutionStage } from "./ValidationExecutionStage";
import { NodeConfig } from "./NodeConfig";
import { ValidationResult } from ".";

export interface NodeValidator {
  (stage: ValidationExecutionStage, config: NodeConfig, data: any): Promise<ValidationResult>
}