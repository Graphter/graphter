import React from 'react'
import { useRecoilNodeData } from "./useRecoilNodeData"
import { useRecoilState } from "recoil";
import { act, fireEvent, render } from "@testing-library/react"
import { when } from 'jest-when'
import propDataStore from "../store/propDataStore";

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
      'Bob',
      true)
    expect(propDataStoreMock.set).toHaveBeenCalledWith(
      ['/'],
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
    when(useRecoilStateMock)
      .calledWith('The result')
      .mockReturnValue('The recoil result')
    const result = useRecoilNodeData(
      ['/'],
      'Bob',
      true)
    expect(result).toBe('The recoil result')
  })
})

export {}