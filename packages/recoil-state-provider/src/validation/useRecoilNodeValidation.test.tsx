import { NodeValidatorRegistration, ValidationExecutionStage } from "@graphter/core";
import React from "react";
import { render } from "@testing-library/react";
import { RecoilRoot } from 'recoil'
import { NodeValidationHook, pathConfigStore } from "@graphter/renderer-react";
import { when } from "jest-when";
import flushPromises from "../../test-utils/flushPromises";
import validationDataStore from "../store/validationDataStore";

const pathConfigStoreMock = pathConfigStore as jest.Mocked<any>

describe('useRecoilNodeValidation', () => {
  let useRecoilNodeValidation: NodeValidationHook,
    validatorRegistration: NodeValidatorRegistration,
    validatorMock: jest.Mock<any>,
    propDataStore: any

  function ConsumerComponent({ cb }: { cb?: (data: any) => void }) {
    const validationData = useRecoilNodeValidation([ 'page' ], [ validatorRegistration ])
    if(cb) cb(validationData)
    return null
  }

  beforeEach(() => {
    validatorMock = jest.fn()
    validatorRegistration = {
      type: 'test-validation',
      validatorSetup: () => {
        return validatorMock
      }
    }
    pathConfigStoreMock.get.mockReset()
    jest.isolateModules(() => {
      useRecoilNodeValidation = require('./useRecoilNodeValidation').useRecoilNodeValidation
      propDataStore = require('../store/propDataStore')
    })
  })

  it('should return validation data for a node', async () => {
    propDataStore.set(['page'], true, 'the-page-data')
    const config = {
      id: 'page',
      type: 'object',
      validation: [
        {
          type: 'test-validation',
          executeOn: ValidationExecutionStage.CHANGE,
          options: { some: 'validation-constraints' }
        },
        {
          type: 'test-validation',
          executeOn: ValidationExecutionStage.CHANGE,
          options: { someOther: 'validation-constraints' }
        }
      ]
    }
    when(pathConfigStoreMock.get)
      .calledWith(['page'])
      .mockReturnValue(config)

    validationDataStore.set(['page'], config, 'the-page-data', [])
    validatorMock.mockResolvedValueOnce({
      valid: false,
      errorMessage: 'Some error message'
    })
    validatorMock.mockResolvedValueOnce({
      valid: false,
      errorMessage: 'Some other error message'
    })
    const cbMock = jest.fn()
    render(
      <RecoilRoot>
        <ConsumerComponent cb={cbMock} />
      </RecoilRoot>
    )
    await flushPromises()
    expect(cbMock).toHaveBeenCalledTimes(3)
    const result = cbMock.mock.calls[2][0]
    expect(result.results.length).toBe(2)
    expect(result.results[0].valid).toBe(false)
    expect(result.results[0].errorMessage).toBe('Some error message')
    expect(result.results[1].valid).toBe(false)
    expect(result.results[1].errorMessage).toBe('Some other error message')
  })
  it('should skip any validator other than those configured to run onChange', async () => {
    propDataStore.set(['page'], true, 'the-page-data')
    // when(useRecoilValueMock)
    //   .calledWith()
    //   .mockReturnValueOnce('the-prop-data')
    const config = {
      id: 'page',
      type: 'object',
      validation: [
        {
          type: 'test-validation',
          executeOn: ValidationExecutionStage.CHANGE,
          options: { some: 'validation-constraints' }
        },
        {
          type: 'test-validation',
          executeOn: ValidationExecutionStage.CLIENT_CREATE,
          options: { someOther: 'validation-constraints' }
        }
      ]
    }
    when(pathConfigStoreMock.get)
      .calledWith(['page'])
      .mockReturnValue(config)

    validationDataStore.set(['page'], config, 'the-page-data', [])
    validatorMock.mockResolvedValueOnce({
      valid: false,
      errorMessage: 'Some error message'
    })
    const cbMock = jest.fn()
    render(
      <RecoilRoot>
        <ConsumerComponent cb={cbMock} />
      </RecoilRoot>
    )
    await flushPromises()
    expect(cbMock).toHaveBeenCalledTimes(3)
    const result = cbMock.mock.calls[2][0]
    expect(result.results.length).toBe(1)
    expect(result.results[0].valid).toBe(false)
    expect(result.results[0].errorMessage).toBe('Some error message')
  })
  it('should return empty validation data if no onChange validators are found', async () => {
    propDataStore.set(['page'], true, 'the-page-data')
    // when(useRecoilValueMock)
    //   .calledWith()
    //   .mockReturnValueOnce('the-prop-data')
    const config = {
      id: 'page',
      type: 'object',
      validation: [
        {
          type: 'test-validation',
          executeOn: ValidationExecutionStage.SERVER_UPDATE,
          options: { some: 'validation-constraints' }
        },
        {
          type: 'test-validation',
          executeOn: ValidationExecutionStage.CLIENT_CREATE,
          options: { someOther: 'validation-constraints' }
        }
      ]
    }
    when(pathConfigStoreMock.get)
      .calledWith(['page'])
      .mockReturnValue(config)

    validationDataStore.set(['page'], config, 'the-page-data', [])
    validatorMock.mockResolvedValueOnce({
      valid: false,
      errorMessage: 'Some error message'
    })
    const cbMock = jest.fn()
    render(
      <RecoilRoot>
        <ConsumerComponent cb={cbMock} />
      </RecoilRoot>
    )
    await flushPromises()
    expect(cbMock).toHaveBeenCalledTimes(3)
    const result = cbMock.mock.calls[2][0]
    expect(result.results.length).toBe(0)
  })
  it('should return empty validation data if the node has no data', async () => {
    const config = {
      id: 'page',
      type: 'object',
      validation: [
        {
          type: 'test-validation',
          executeOn: ValidationExecutionStage.CHANGE,
          options: { some: 'validation-constraints' }
        }
      ]
    }
    when(pathConfigStoreMock.get)
      .calledWith(['page'])
      .mockReturnValue(config)

    validationDataStore.set(['page'], config, 'the-page-data', [])
    validatorMock.mockResolvedValueOnce({
      valid: false,
      errorMessage: 'Some error message'
    })
    const cbMock = jest.fn()
    render(
      <RecoilRoot>
        <ConsumerComponent cb={cbMock} />
      </RecoilRoot>
    )
    await flushPromises()
    expect(cbMock).toHaveBeenCalledTimes(1)
    const result = cbMock.mock.calls[0][0]
    expect(result.results.length).toBe(0)
  })
  it('should set initial validationDataStore data if none exists yet', async () => {
    propDataStore.set(['page'], true, 'the-page-data')
    const config = {
      id: 'page',
      type: 'object',
      validation: [
        {
          type: 'test-validation',
          executeOn: ValidationExecutionStage.CHANGE,
          options: { some: 'validation-constraints' }
        }
      ]
    }
    when(pathConfigStoreMock.get)
      .calledWith(['page'])
      .mockReturnValue(config)
    validationDataStore.set(['page'], config, 'the-page-data', [])
    validatorMock.mockResolvedValueOnce({
      valid: false,
      errorMessage: 'Some error message'
    })
    const cbMock = jest.fn()
    render(
      <RecoilRoot>
        <ConsumerComponent cb={cbMock} />
      </RecoilRoot>
    )
    await flushPromises()
    expect(cbMock).toHaveBeenCalledTimes(3)
    const result = cbMock.mock.calls[2][0]
    expect(result.results.length).toBe(1)
    expect(result.results[0].valid).toBe(false)
    expect(result.results[0].errorMessage).toBe('Some error message')
    expect(validationDataStore.has(['page'])).toBe(true)
  })
  it('should error if unable to find config for the node', async () => {
    propDataStore.set(['page'], true, 'the-page-data')
    expect(() => render(
      <RecoilRoot>
        <ConsumerComponent />
      </RecoilRoot>
    )).toThrowErrorMatchingSnapshot()
  })
})
export {}