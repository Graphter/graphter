export {}
import { NodeConfig, ValidationErrorDisplayMode, ValidationExecutionStage } from "@graphter/core";
import jsonSchemaNodeValidatorSetup from "./jsonSchemaNodeValidatorSetup";


describe(`JsonSchemaPropertyValidator`, () => {
  let nodeConfig: NodeConfig;
  beforeEach(() => {
    nodeConfig = {
      id: 'title',
      name: 'Title',
      type: 'string'
    }
  })
  it(`should return a valid response when executed with correct data`, async () => {
    const validator = jsonSchemaNodeValidatorSetup({
      schema: {
        minLength: 3
      }
    });
    const result = await validator(ValidationExecutionStage.CHANGE, nodeConfig, 'A valid page title');
    expect(result).not.toBeNull();
    expect(result.valid).toBe(true);
  });
  it(`should return an invalid response when executed with incorrect data`, async () => {
    const validator = jsonSchemaNodeValidatorSetup({
      schema: {
        minLength: 3
      },
      error: `Title must be at least 3 characters long`
    });
    const result = await validator(ValidationExecutionStage.CHANGE, nodeConfig, 'A');
    expect(result).not.toBeNull();
    expect(result.valid).toBe(false);
    expect(result.errorMessage).toBe(`Title must be at least 3 characters long`);
  });
  it(`should error when no schema is provided`, () => {
    expect(() => {
      // @ts-ignore
      jsonSchemaNodeValidatorSetup();
    }).toThrowErrorMatchingSnapshot();
  });
  it(`should return correct error display mode`, async () => {
    const validator = jsonSchemaNodeValidatorSetup({
      schema: {
        maxLength: 5
      },
      errorDisplayMode: ValidationErrorDisplayMode.MODAL
    });
    const result = await validator(ValidationExecutionStage.CLIENT_UPDATE, nodeConfig, 'Hello World!');
    expect(result.errorDisplayMode).not.toBeNull();
    expect(result.errorDisplayMode).toEqual([ ValidationErrorDisplayMode.MODAL ]);
  })
  it(`should default options correctly`, async () => {
    const validator = jsonSchemaNodeValidatorSetup({
      schema: {
        maxLength: 5
      }
    });
    const result = await validator(ValidationExecutionStage.CLIENT_UPDATE, nodeConfig, 'Hello World!');
    expect(result.errorDisplayMode).toMatchSnapshot()
  });
});

export {};