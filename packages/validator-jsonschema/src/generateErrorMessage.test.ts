import generateErrorMessage from "./generateErrorMessage";
import { ValidateFunction } from "ajv";

describe('generateErrorMessage.test.ts', () => {
  it(`should generate a dynamic message when function is provided`, () => {
    const result = generateErrorMessage(
      {foo: 'bar'},
      {
        schema: {},
        error: (data) => `a dynamic error message (${data.foo})`
      },
      (() => false) as any);
    expect(result).toBe('a dynamic error message (bar)');
  });
  it(`should return static error when a string is defined`, () => {
    const result = generateErrorMessage({foo: 'bar'}, {
      schema: {},
      error: 'a static error message'
    }, (() => false) as any);
    expect(result).toBe('a static error message');
  });
  it(`should concatenate the AJV error messages when no error option is defined`, () => {
    const validateFn = (() => false) as any
    validateFn.errors = [
      {message: 'this is the first problem', keyword: '', dataPath: '', schemaPath: '', params: {}},
      {message: 'this is the second problem', keyword: '', dataPath: '', schemaPath: '', params: {}}
    ];
    const result = generateErrorMessage({foo: 'bar'}, {
      schema: {},
    }, validateFn);
    expect(result).toBe('this is the first problem. this is the second problem');
  });
  it(`should fall back to a stock message when all else fails`, () => {
    const result = generateErrorMessage({foo: 'bar'}, {
      schema: {},
    }, (() => false) as any);
    expect(result).toBe('Some validation rule failed');
  });
});

export {};