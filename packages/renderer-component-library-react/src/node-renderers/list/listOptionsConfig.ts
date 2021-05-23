import { NodeConfig } from "@graphter/core";

export const listOptionsConfig: NodeConfig = {
  id: 'list-options',
  name: 'List options',
  type: 'object',
  default: {
    serviceId: '',
    keyPath: [],
    valuePath: []
  },
  children: [
    {
      id: 'itemSelectionBehaviour',
      type: 'select',
      name: 'Item Selection Behaviour',
      description: 'Edit mode of list items',
      options: {
        options: {
          'CUSTOM': 'Custom',
          'INLINE': 'Inline'
        }
      },
      default: 'INLINE'
    },
    {
      id: 'maxItems',
      type: 'number',
      name: 'Maximum Items',
      description: 'The maximum number of items allowed in the list. Leave blank for unlimited.',
    }
  ]
}