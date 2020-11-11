import { ValidationExecutionStage } from "./ValidationExecutionStage";
import { NodeConfig } from "./NodeConfig";
import { ValidationResult } from "./ValidationResult";

export interface NodeValidatorRegistration {
  type: string,
  validatorSetup: (options: any) => (
    stage: ValidationExecutionStage,
    config: NodeConfig,
    data: any) => Promise<ValidationResult>,
}