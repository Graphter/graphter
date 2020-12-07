import registerJsonSchemaValidatorSetup from './registerJsonSchemaValidatorSetup'
import jsonSchemaNodeValidatorSetup from "./jsonSchemaNodeValidatorSetup";

describe('registerJsonSchemaValidatorSetup', () => {
  it('should output the correct object', () => {
    const result = registerJsonSchemaValidatorSetup()
    expect(result.type).toBe('json-schema')
    expect(result.validatorSetup).toBe(jsonSchemaNodeValidatorSetup)
  })
})