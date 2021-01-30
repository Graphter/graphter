import { AllValidationExecutionStages, NodeConfig } from "@graphter/core";

const config:NodeConfig = {
  id: 'config',
  name: 'Graphter Config',
  description: 'The configuration that drives Graphter models',
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
            error: 'An ID is required',
            schema: {
              "minLength": 1
            },
          }
        },
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
        },
        {
          type: 'id-uniqueness',
          executeOn: AllValidationExecutionStages,
        }
      ]
    },
    {
      id: 'name',
      name: 'Name',
      description: 'The model name',
      type: 'string',
      validation: [
        {
          type: 'json-schema',
          executeOn: AllValidationExecutionStages,
          options: {
            error: 'An ID is required',
            schema: {
              "minLength": 1
            },
          }
        },
      ]
    },
    {
      id: 'description',
      name: 'Description',
      description: 'A description of the model',
      type: 'string',
      validation: [ ]
    },
    {
      id: 'type',
      name: 'Type',
      description: 'The type of data',
      type: 'data-select',
      children: [ ],
      validation: [ ],
      options: {
        service: 'node-renderer',
        keyPath: [ 'type' ],
        valuePath: [ 'name' ]
      }
    },
    {
      id: 'children',
      type: 'conditional',
      children: [
        {
          id: 'object-children',
          name: 'Object properties',
          description: 'Properties configured for the object type',
          type: 'list',
          children: [
            {
              id: 'child',
              name: 'Child',
              description: 'The nested child config',
              type: 'nested',
              options: {
                configId: 'config'
              }
            },
          ],
          validation: [ ]
        }
      ],
      validation: [ ],
      options: {
        siblingPath: ['type'],
        branches: [
          { condition: 'object', childId: 'object-children' }
        ]
      }
    }
  ],
  validation: [

  ],
}

export default config