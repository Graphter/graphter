# Contributing

## Definition of done
* Functionality complete
* Unit Tests
* Integration (optional but check if appropriate)
* Cypress Tests (optional but check if appropriate)
* Added to kitchen sink example (optional but check if appropriate)

# Testing
Package dependencies are set up using npm-link so that each package can be run with `npm start` and updates to dependencies will automatically reflect across dependent packages...

## Restrictions 
...but there are restrictions in this setup:

### Unit tests should not span multiple packages
Using NPM link results in nested node_modules folders resulting in potentially different instances of the same module being resolved by ts-node. This will result in the `Error: Invalid hook call. Hooks can only be called inside of the body of a function component` error being returned when testing components that use hooks.

Solution: Units being tested should not include modules from dependent packages. Mock them out instead.
