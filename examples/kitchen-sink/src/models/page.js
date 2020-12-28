import { AllValidationExecutionStages } from "@graphter/core";

export default {
  id: 'page',
  name: 'Page',
  descriptions: 'A page in a blog',
  type: 'object',
  children: [
    {
      id: 'title',
      name: 'Title',
      description: 'The page title',
      type: 'string',
      validation: [
        {
          type: 'json-schema',
          executeOn: AllValidationExecutionStages,
          displayMode: [ 'INLINE', 'SUMMARY', 'MODAL' ],
          options: {
            error: 'Must be at least 1 character longss',
            schema: {
              "minLength": 1
            },
          }
        },
        {
          type: 'json-schema',
          executeOn: AllValidationExecutionStages,
          displayMode: [ 'INLINE', 'SUMMARY', 'MODAL' ],
          options: {
            error: 'Cannot be more than 255 characters long',
            schema: {
              "maxLength": 255
            },
          }
        }
      ]
    },
    {
      id: 'metadata',
      name: 'Metadata',
      type: 'string'
    },
    {
      id: 'authors',
      name: 'Authors',
      description: 'The authors',
      type: 'list',
      children: [
        {
          id: 'author',
          type: 'object',
          children: [
            {
              id: 'name',
              name: 'Name',
              description: ' ',
              type: 'string',
              validation: [
                {
                  type: 'json-schema',
                  executeOn: AllValidationExecutionStages,
                  displayMode: [ 'INLINE', 'SUMMARY', 'MODAL' ],
                  options: {
                    error: 'Must be at least 1 character long',
                    schema: {
                      "minLength": 1
                    },
                  }
                },
              ]
            },
            {
              id: 'location',
              name: 'Location',
              description: ' ',
              type: 'string'
            }
          ]
        }
      ]
    },
    {
      id: 'body',
      name: 'Body',
      description: 'The content of the page',
      type: 'string'
    },
    {
      id: 'tags',
      name: 'Tags',
      description: 'Page tags',
      type: 'list',
      listItemType: 'string',
      children: [
        {
          id: 'tag',
          name: 'Tag',
          description: 'A tag',
          type: 'string',
          default: '',
          validation: [
            {
              type: 'json-schema',
              executeOn: AllValidationExecutionStages,
              displayMode: [ 'INLINE', 'SUMMARY', 'MODAL' ],
              options: {
                error: 'Must be at least 1 character long',
                schema: {
                  "minLength": 1
                },
              }
            },
          ],
        }
      ]
    }
  ],
  validation: [

  ],
}