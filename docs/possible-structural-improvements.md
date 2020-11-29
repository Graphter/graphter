# Areas for possible structural improvement

## Validation
Why do we need a recoil/provider specific validator? Could we not just pass state from the component directly to the validator? We could remove the provider integration layer and interact directly with the supplied validator (e.g jsonschema)

## Pagination
Doesn't follow patterns established elsewhere. To Review.