import { NodeConfig } from "@graphter/core";

export const dataSelectOptionsConfig: NodeConfig = {
  id: 'options',
  name: 'Data Select Options',
  type: 'object',
  default: {
    serviceId: '',
    keyPath: [],
    valuePath: []
  },
  children: [
    {
      id: 'serviceId',
      type: 'data-select',
      name: 'Service',
      description: 'The service that will provide the data used by the Data Select node',
      options: {
        serviceId: 'service',
        keyPath: [ 'id' ],
        valuePath: [ 'id' ]
      }
    },
    {
      id: 'valuePath',
      type: 'dynamic-data-path-select',
      name: 'Value Path',
      description: 'Select how we extract display values from the data',
      children: [
        {
          id: 'path-segment',
          type: 'string'
        }
      ],
      options: {
        serviceIdPathQuery: [ { $up: 1 }, 'serviceId' ]
      }
    },
    {
      id: 'keyPath',
      type: 'dynamic-data-path-select',
      name: 'Key Path',
      description: 'Select how we extract actual values from the data',
      children: [],
      options: {
        serviceIdPathQuery: [ { $up: 1 }, 'serviceId' ]
      }
    },
  ]
}