import { ValidationDataStore } from "./validationDataStore";
import { RecoilRoot, useRecoilValue } from "recoil";
import { render } from "@testing-library/react";
import React from "react";
import { PathSegment } from "@graphter/core";
import PropDataStore from "./propDataStore";

describe('validationDataStore', () => {
  let validationDataStore: ValidationDataStore,
    propDataStore: PropDataStore

  function GetConsumerComponent({ cb }: { cb?: (data: any) => void }){
    const validationData = useRecoilValue(validationDataStore.get(['page']))
    if(cb) cb(validationData)
    return null
  }

  beforeEach(() => {
    jest.isolateModules(() => {
      validationDataStore = require('./validationDataStore')
      propDataStore = require('./propDataStore')
    })
  })
  it('should set and get validation data', () => {
    validationDataStore.set(
      ['page'],
      'the-page-value',
      [ { valid: false, errorMessage: 'Some error' }]
      )
    const cbMock = jest.fn()
    render(
      <RecoilRoot>
        <GetConsumerComponent cb={cbMock} />
      </RecoilRoot>
    )
    expect(cbMock).toHaveBeenCalled()
    expect(cbMock.mock.calls[0][0]).toMatchSnapshot()
  })
  describe('get()', () => {
    it('should error if no validation data has been set yet', () => {
      expect(() => render(
        <RecoilRoot>
          <GetConsumerComponent />
        </RecoilRoot>
      )).toThrowErrorMatchingSnapshot()
    })
  })
  describe('getAll()', () => {
    function GetAllConsumerComponent({ paths, cb }: {
      paths: Array<Array<PathSegment>>
      cb?: (data: any) => void
    }){
    const validationData = useRecoilValue(validationDataStore.getAll(paths))
    if(cb) cb(validationData)
    return null
  }
    it('should return a selector that aggregates results for all the supplied paths', () => {
      validationDataStore.set(
        ['page'],
        'the-page-value',
        [ { valid: false, errorMessage: 'Some page error' }]
      )
      validationDataStore.set(
        ['page', 'title'],
        'the-title-value',
        [ { valid: false, errorMessage: 'Some title error' }]
      )
      const cbMock = jest.fn()
      render(
        <RecoilRoot>
          <GetAllConsumerComponent paths={[ ['page'], ['page', 'title'] ]} cb={cbMock} />
        </RecoilRoot>
      )
      expect(cbMock).toHaveBeenCalled()
      expect(cbMock.mock.calls[0][0]).toMatchSnapshot()
    })
    it('should cache the selector for subsequent uses', () => {
      validationDataStore.set(
      ['page'],
      'the-page-value',
      [ { valid: false, errorMessage: 'Some page error' }]
      )
      validationDataStore.set(
        ['page', 'title'],
        'the-title-value',
        [ { valid: false, errorMessage: 'Some title error' }]
      )
      const selector1 = validationDataStore.getAll([ ['page'], ['page', 'title'] ])
      const selector2 = validationDataStore.getAll([ ['page'], ['page', 'title'] ])
      expect(selector1).toBe(selector2)
    })
    it('should initialise state on the fly when not already initialised', () => {
      propDataStore.set(
        ['page'],
        true,
        'the-page-value'
      )
      propDataStore.set(
        ['page', 'title'],
        true,
        'the-title-value',
      )
      const cbMock = jest.fn()
      render(
        <RecoilRoot>
          <GetAllConsumerComponent paths={[ ['page'], ['page', 'title'] ]} cb={cbMock} />
        </RecoilRoot>
      )
      expect(cbMock).toHaveBeenCalled()
      expect(cbMock.mock.calls[0][0]).toMatchSnapshot()
    })
  })
  describe('has()', () => {
    it('should return true if validation data set been set', () => {
      validationDataStore.set(
        ['page'],
        'the-page-value',
        [ { valid: false, errorMessage: 'Some page error' }]
      )
      expect(validationDataStore.has(['page'])).toBe(true)
    })
    it('should return false if validation has not been set', () => {
      expect(validationDataStore.has(['page'])).toBe(false)
    })
  })
  describe('set()', () => {
    it('should error if no path is supplied', () => {
      expect(() => validationDataStore.set(
        // @ts-ignore
        null,
        'the-page-value',
        []
      )).toThrowErrorMatchingSnapshot()
    })
  })
})
export {}