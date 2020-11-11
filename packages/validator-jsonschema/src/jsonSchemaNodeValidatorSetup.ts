import { JsonSchemaValidatorOptions } from "./JsonSchemaValidatorOptions";
import {
  NodeConfig, ValidationErrorDisplayMode,
  ValidationExecutionStage,
  ValidationResult
} from "@graphter/core";
import generateErrorMessage from "./generateErrorMessage";
import Ajv from "ajv";

export default function jsonSchemaNodeValidatorSetup(options: JsonSchemaValidatorOptions){
  if(!options || !options.schema) throw new Error(`Schema option is required by JsonSchemaValidator`);
  options = {
    executeOn: [
      ValidationExecutionStage.CLIENT_CREATE,
      ValidationExecutionStage.CLIENT_UPDATE,
      ValidationExecutionStage.SERVER_UPDATE,
      ValidationExecutionStage.SERVER_UPDATE
    ],
    errorDisplayMode: [
      ValidationErrorDisplayMode.INLINE,
      ValidationErrorDisplayMode.SUMMARY
    ],
    ...options
  };

  if(options.executeOn === undefined) throw new Error(`Shouldn't happen if defaulting was done properly`)

  const ajv = new Ajv({
    jsonPointers: true,
    allErrors: true
  });
  const validateFn = ajv.compile(options.schema);


  return function execute(
    stage: ValidationExecutionStage,
    config: NodeConfig,
    data: any,
  ): Promise<ValidationResult> {
    const valid = validateFn(data);
    console.log(`${config.id} value of ${JSON.stringify(data)} ${valid?'passed':'failed'} validation: ${JSON.stringify(options)}`)
    if(valid){
      return Promise.resolve({
        valid: true,
        dataPaths: [ config.id ]
      });
    } else {
      const result: ValidationResult = {
        valid: false,
        errorMessage: generateErrorMessage(data, options, validateFn),
      }

      if(validateFn.errors){
        result.dataPaths = validateFn.errors.map(err => config.id + err.dataPath);
      }

      if(Array.isArray(options.errorDisplayMode)){
        result.errorDisplayMode = options.errorDisplayMode;
      } else if(options.errorDisplayMode !== undefined){
        result.errorDisplayMode = [ options.errorDisplayMode ];
      }

      return Promise.resolve(result);
    }
  }

}