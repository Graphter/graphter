import { AllValidationExecutionStages } from "@graphter/core";

export default {
  id: 'config',
  name: 'Graphter Config',
  descriptions: 'The configuration that drives Graphter models',
  type: 'object',
  children: [
    {
      id: 'id',
      name: 'ID',
      description: 'The ID of the model',
      type: 'id',
      validation: [
        {
          type: 'json-schema',
          executeOn: AllValidationExecutionStages,
          options: {
            error: 'Only lowercase alphanumeric and hyphen characters are allowed in IDs',
            schema: {
              'type': 'string',
              'regexp': '/^[a-z0-9-]*$/',
            },
          }
        }
      ]
    }
  ],
  validation: [

  ],
}