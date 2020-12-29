# Graphter
A generic data management framework.

Your data is not so special. Graphter allows humans to manage _any_ data structure, starting with its own configuration files.

1. Generic - compose any data structure from primitive data types
1. Modular & Swappable - just a series of interfaces with some pre-built implementations
1. Customisable - easily take control where needed
1. Frontend agnostic - it manages data, what you do with it is up to you

## Packages
1. [Core](packages/core/README.md) - framework interfaces
1. Renderers - iterates model configuration and renders CMS UI
    1. [React](packages/renderer-react/README.md)
    1. Angular (roadmap)
1. Node Renderers - a basic set of content types (e.g. string, object, list, html text, etc...)
    1. [React](packages/renderer-component-library-react/README.md)
    1. Angular (roadmap)
1. Validation - validates your data, client and server side
    1. [JsonSchema](packages/validator-jsonschema/README.md)
    1. YUP (roadmap)
1. Persistence
    1. PouchDB + FlexSearch.js (local)
    1. MongoDB + Elasticsearch + S3
    1. Postgres + Elasticsearch + S3
1. API Layer
    1. GraphQL schema generator
    1. Apollo bootstrapper
    1. Express bootstrapper (roadmap)
    1. Koa bootstrapper (roadmap)
1. Infrastructure Provisioner (priority TBD)
    1. Terraform
    1. Pulumi
1. Eventing
    1. JS events (local)
    1. SQS
    
## Short term priorities
[Why bother having anything else?](./docs/short-term-priorities.md)

## Medium term plan
Start throwing different data management scenarios at it and iterating as stresses are found and remedied.

For example:
1. CMS
1. CRM
1. Risk assessment workflows 
1. Inventory management
1. Invoicing and timesheeting 
1. 2D canvas systems (e.g. Mural) 
1. Media library management

## Long term
Provide managed cloud solutions on top of the open source tooling.
    
## Contributing
See [Contributing Docs](./docs/contributing.md)