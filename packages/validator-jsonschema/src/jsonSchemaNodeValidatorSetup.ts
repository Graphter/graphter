import { JsonSchemaValidatorOptions } from "./JsonSchemaValidatorOptions";
import {
  NodeConfig,
  ValidationErrorDisplayMode,
  ValidationExecutionStage,
  ValidationResult
} from "@graphter/core";
import generateErrorMessage from "./generateErrorMessage";
import ajvKeywords from "ajv-keywords";
import Ajv from "ajv";

export default function jsonSchemaNodeValidatorSetup(options: JsonSchemaValidatorOptions){
  if(!options || !options.schema) throw new Error(`Schema option is required by JsonSchemaValidator`);
  options = {
    errorDisplayMode: [
      ValidationErrorDisplayMode.INLINE,
      ValidationErrorDisplayMode.SUMMARY
    ],
    ...options
  };

  const ajv = new Ajv({
    jsPropertySyntax: true,
    allErrors: true
  });
  ajvKeywords(ajv)
  const validateFn = ajv.compile(options.schema);


  return function execute(
    stage: ValidationExecutionStage,
    config: NodeConfig,
    data: any,
  ): Promise<ValidationResult> {
    const valid = validateFn(data);
    console.debug(`${config.id} value of ${JSON.stringify(data)} ${valid?'passed':'failed'} validation: ${JSON.stringify(options)}`)
    if(valid){
      return Promise.resolve({
        valid: true
      });
    } else {
      const result: ValidationResult = {
        valid: false,
        errorMessage: generateErrorMessage(data, options, validateFn),
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