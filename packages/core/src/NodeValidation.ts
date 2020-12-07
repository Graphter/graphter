import { ValidationExecutionStage } from "./ValidationExecutionStage";

export interface NodeValidation {
  type: string,
  executeOn: ValidationExecutionStage | ValidationExecutionStage[]
  options: any
}