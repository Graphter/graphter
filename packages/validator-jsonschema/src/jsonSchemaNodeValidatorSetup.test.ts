import AJV from 'ajv'
import generateErrorMessage from "./generateErrorMessage";

import jsonSchemaNodeValidatorSetup from './jsonSchemaNodeValidatorSetup'
import { ValidationExecutionStage } from "@graphter/core";

jest.mock('ajv')
jest.mock('./generateErrorMessage')

const AJVMock = AJV as jest.Mocked<any>
const generateErrorMessageMock = generateErrorMessage as jest.Mock<any>

describe('jsonSchemaNodeValidatorSetup', () => {

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

  it('should use sensible defaults', async () => {
    AJVMock.mockImplementation(() => ({
      compile: () => () => false
    }))
    const execute = await jsonSchemaNodeValidatorSetup({ schema: {} })
    execute(ValidationExecutionStage.CHANGE,
      { id: 'name', type: 'string' },
      'some-data')
    expect(generateErrorMessageMock).toHaveBeenCalled()
    expect(generateErrorMessageMock.mock.calls[0][1]).toMatchSnapshot()
  })

  it('should compile the schema to a validator function ', async () => {
    const compileMock = jest.fn().mockReturnValue(() => true)
    AJVMock.mockImplementation(() => ({
      compile: compileMock
    }))
    await jsonSchemaNodeValidatorSetup({ schema: { some: 'schema' } })
    expect(compileMock).toHaveBeenCalledWith({ some: 'schema' })
  })

  it('should execute the validator function', async () => {
    const validatorMock = jest.fn().mockReturnValue(true)
    AJVMock.mockImplementation(() => ({
      compile: () => validatorMock
    }))
    const execute = await jsonSchemaNodeValidatorSetup({ schema: {} })
    execute(ValidationExecutionStage.CHANGE,
      { id: 'name', type: 'string' },
      'some-data')
    expect(validatorMock).toHaveBeenCalledWith('some-data')
  })

  it('should return the correct result when data is valid', async () => {
    const validatorMock = jest.fn().mockReturnValue(true)
    AJVMock.mockImplementation(() => ({
      compile: () => validatorMock
    }))
    const execute = await jsonSchemaNodeValidatorSetup({ schema: {} })
    const result = execute(ValidationExecutionStage.CHANGE,
      { id: 'name', type: 'string' },
      'some-data')
    expect(result).toMatchSnapshot()
  })

  it('should return the correct result when did is not valid', async () => {
    const validatorMock = jest.fn().mockReturnValue(false)
    AJVMock.mockImplementation(() => ({
      compile: () => validatorMock
    }))
    const execute = await jsonSchemaNodeValidatorSetup({ schema: {} })
    const result = execute(ValidationExecutionStage.CHANGE,
      { id: 'name', type: 'string' },
      'some-data')
    expect(result).toMatchSnapshot()
  })

})

export {}