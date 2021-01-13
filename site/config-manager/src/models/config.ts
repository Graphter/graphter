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
       
      ]
    }
  ],
  validation: [

  ],
}