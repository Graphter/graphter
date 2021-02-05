import AJV from 'ajv'
import generateErrorMessage from "./generateErrorMessage";

import jsonSchemaNodeValidatorSetup from './jsonSchemaNodeValidatorSetup'
import { ValidationExecutionStage } from "@graphter/core";
import ajvKeywords from "ajv-keywords";
import Ajv from "ajv";

jest.mock('ajv', () => {
  const MockAjv = {
    compile: jest.fn()
  }
  return jest.fn(() => MockAjv)
})
jest.mock('ajv-keywords')
jest.mock('./generateErrorMessage')

const AJVMock = AJV as jest.Mocked<any>
const generateErrorMessageMock = generateErrorMessage as jest.Mock<any>

describe('jsonSchemaNodeValidatorSetup', () => {
  let ajvMock: jest.Mocked<any>
  beforeEach(() => {
    ajvMock =  new Ajv();
  })

  it('should compile the schema to a validator function ', async () => {
    ajvMock.compile.mockReturnValueOnce(() => true)
    await jsonSchemaNodeValidatorSetup({ schema: { some: 'schema' } })
    expect(ajvKeywords).toHaveBeenCalledWith(ajvMock)
  })

  it('should use ajv keywords library', async () => {
    ajvMock.compile.mockReturnValueOnce(() => true)
    await jsonSchemaNodeValidatorSetup({ schema: { some: 'schema' } })
    expect(ajvMock.compile).toHaveBeenCalledWith({ some: 'schema' })
  })

  it('should use sensible defaults', async () => {
    ajvMock.compile.mockReturnValueOnce(() => false)
    const execute = await jsonSchemaNodeValidatorSetup({ schema: {} })
    await execute(ValidationExecutionStage.CHANGE,
      { id: 'name', type: 'string' },
      ['page'],
      'some-data')
    expect(generateErrorMessageMock).toHaveBeenCalled()
    expect(generateErrorMessageMock.mock.calls[0][1]).toMatchSnapshot()
  })

  it('should execute the validator function', async () => {
    const validatorMock = jest.fn().mockReturnValueOnce(true)
    ajvMock.compile.mockReturnValueOnce(validatorMock)
    const execute = await jsonSchemaNodeValidatorSetup({ schema: {} })
    await execute(ValidationExecutionStage.CHANGE,
      { id: 'name', type: 'string' },
      ['page'],
      'some-data')
    expect(validatorMock).toHaveBeenCalledWith('some-data')
  })

  it('should return the correct result when data is valid', async () => {
    const validatorMock = jest.fn().mockReturnValueOnce(true)
    ajvMock.compile.mockReturnValueOnce(validatorMock)
    const execute = await jsonSchemaNodeValidatorSetup({ schema: {} })
    const result = await execute(ValidationExecutionStage.CHANGE,
      { id: 'name', type: 'string' },
      ['page'],
      'some-data')
    expect(result).toMatchSnapshot()
  })

  it('should return the correct result when data is not valid', async () => {
    const validatorMock = jest.fn().mockReturnValueOnce(false)
    ajvMock.compile.mockReturnValueOnce(validatorMock)
    const execute = await jsonSchemaNodeValidatorSetup({ schema: {} })
    const result = await execute(ValidationExecutionStage.CHANGE,
      { id: 'name', type: 'string' },
      ['page'],
      'some-data')
    expect(result).toMatchSnapshot()
  })

  it('should error when no options are provided', async () => {
    // @ts-ignore
    await expect(() => jsonSchemaNodeValidatorSetup())
      .toThrow('Schema option is required by JsonSchemaValidator')
  })

  it('should error when no schema is provided', async () => {
    // @ts-ignore
    await expect(() => jsonSchemaNodeValidatorSetup({}))
      .toThrow('Schema option is required by JsonSchemaValidator')
  })


})

export {}