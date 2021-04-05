import { NodeConfig } from "@graphter/core";

export const dataSelectOptionsConfig: NodeConfig = {
  id: 'options',
  name: 'Data Select Options',
  type: 'object',
  children: [
    {
      id: 'serviceId',
      type: 'string',
      name: 'Service ID'
    },
    {
      id: 'keyPath',
      type: 'list',
      name: 'Key Path',
      children: [
        {
          id: 'path-segment',
          type: 'string'
        }
      ],
      options: {
        itemSelectionBehaviour: 'CUSTOM'
      }
    },
    {
      id: 'valuePath',
      type: 'list',
      name: 'Value Path',
      children: [
        {
          id: 'path-segment',
          type: 'string'
        }
      ],
      options: {
        itemSelectionBehaviour: 'CUSTOM'
      }
    }
  ]
}