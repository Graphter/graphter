import {
  NodeConfig,
  NodeValidatorRegistration, PathSegment,
  ValidationExecutionStage,
  ValidationResult
} from "@graphter/core";
import { getService } from "@graphter/renderer-react";

export default function registerIdUniquenessValidator(): NodeValidatorRegistration {
  return {
    type: 'id-uniqueness',
    validatorSetup: idUniquenessValidatorSetup,
  }
}

interface IdUniquenessValidatorSetupOptions {
  serviceId: string
}

function idUniquenessValidatorSetup(options: IdUniquenessValidatorSetupOptions){
  return async function execute(
    stage: ValidationExecutionStage,
    config: NodeConfig,
    path: Array<PathSegment>,
    data: any,
  ): Promise<ValidationResult> {
    if(!path || path.length < 2) throw new Error(`Invalid path`)
    const result = await getService(options.serviceId).get(data)
    const valid = !result.item || (result.item.id === path[1])
    console.debug(`${config.id} value of ${JSON.stringify(data)} ${valid?'passed':'failed'} validation: ${JSON.stringify(result)}`)
    if(valid){
      return Promise.resolve({
        valid: true
      });
    } else {
      const result: ValidationResult = {
        valid: false,
        errorMessage: `A configuration already exists with the ID '${data}'`,
      }

      return Promise.resolve(result);
    }
  }

}