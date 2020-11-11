import { NodeValidatorRegistration } from "@graphter/core";
import jsonSchemaNodeValidatorSetup from "./jsonSchemaNodeValidatorSetup";

export default function registerJsonSchemaValidatorSetup(): NodeValidatorRegistration {
  return {
    type: 'json-schema',
    validatorSetup: jsonSchemaNodeValidatorSetup,
  }
}