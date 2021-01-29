import { JsonSchemaValidatorOptions } from "./JsonSchemaValidatorOptions";
import { ValidateFunction } from "ajv";

export default function(data: any, options: JsonSchemaValidatorOptions, validateFn: ValidateFunction){
  if(typeof options.error === 'function'){
    return options.error(data);
  }
  if(typeof options.error === 'string'){
    return options.error;
  }
  if(validateFn.errors) {
    return validateFn.errors.map(err => err.message).join('. ');
  }
  return 'Some validation rule failed';
}