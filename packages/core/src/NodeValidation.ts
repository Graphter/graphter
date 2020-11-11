import { ValidationExecutionStage } from "./ValidationExecutionStage";

export interface NodeValidation {
  type: string,
  executeOn: ValidationExecutionStage
  options: any
}