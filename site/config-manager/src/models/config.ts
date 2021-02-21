import { AllValidationExecutionStages, NodeConfig } from "@graphter/core";

const config:NodeConfig = {
  id: 'config',
  name: 'Graphter Config',
  description: 'The configuration that drives Graphter models',
  type: 'object',
  validation: [

  ],
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
          options: {
            serviceId: 'config'
          }
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
            error: 'A name is required',
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
      default: 'text',
      options: {
        service: 'node-renderer',
        keyPath: [ 'type' ],
        valuePath: [ 'name' ]
      }
    },
    {
      id: 'children',
      name: 'Children',
      type: 'conditional',
      validation: [],
      default: [],
      options: {
        siblingPath: ['type'],
        branches: [
          { condition: 'object', childId: 'object-children' },
          { condition: 'list', childId: 'list-children' }
        ]
      },
      children: [
        {
          id: 'object-children',
          name: 'Object properties',
          type: 'list',
          children: [
            {
              id: 'child',
              name: 'Object property',
              description: 'Like an authors name or the first line of an authors address',
              type: 'nested',
              options: {
                configId: 'config'
              }
            },
          ],
          validation: [ ],
          options: {
            itemSelectionBehaviour: 'CUSTOM'
          }
        },
        {
          id: 'list-children',
          name: 'List types',
          type: 'list',
          children: [
            {
              id: 'child',
              name: 'List type',
              description: 'Define what list items look like',
              type: 'nested',
              options: {
                configId: 'config'
              }
            },
          ],
          validation: [ ],
          options: {
            itemSelectionBehaviour: 'CUSTOM',
            maxItems: 1
          }
        }
      ]
    }
  ],
}

export default config