import React from 'react'
import useRecoilNodeData from "./useRecoilNodeData"
import { useRecoilState } from "recoil";
import { act, fireEvent, render } from "@testing-library/react"
import propDataStore from "../store/propDataStore"
import { when } from 'jest-when'

jest.mock('recoil')
jest.mock('../store/propDataStore')

const useRecoilStateMock = useRecoilState as jest.Mock<any>
const propDataStoreMock = propDataStore as jest.Mocked<any>

describe('useRecoilNodeData()', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should set up the original value in the prop data store', () => {
    when(propDataStoreMock.has)
      .calledWith(['/'])
      .mockReturnValue(false)
    useRecoilNodeData(
      ['/'],
      {
        id: 'name',
        type: 'string'
      },
      'Bob',
      true)
    expect(propDataStoreMock.set).toHaveBeenCalledWith(
      ['/'],
      {
        id: 'name',
        type: 'string'
      },
      true,
      'Bob')
  })
  it('should return the correct result', () => {
    when(propDataStoreMock.has)
      .calledWith(['/'])
      .mockReturnValue(true)
    when(propDataStoreMock.get)
      .calledWith(['/'])
      .mockReturnValue('The result')
    const result = useRecoilNodeData(
      ['/'],
      {
        id: 'name',
        type: 'string'
      },
      'Bob',
      true)
    expect(useRecoilStateMock).toHaveBeenCalledWith('The result')
  })
})

export {}