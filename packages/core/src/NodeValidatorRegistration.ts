import { NodeValidator } from "./NodeValidator";

export interface NodeValidatorRegistration {
  type: string,
  validatorSetup: (options: any) => NodeValidator,
}