import { useRecoilAggregateNodeValidation } from "./useRecoilAggregateNodeValidation";
import { RecoilRoot, useRecoilValue } from 'recoil'
import validationDataStore from "../store/validationDataStore";
import React from "react";
import { render } from "@testing-library/react";
import { when } from "jest-when";

jest.mock('recoil')
jest.mock('../store/validationDataStore')

const useRecoilValueMock = useRecoilValue as jest.Mock<any>
const validationDataStoreMock = validationDataStore as jest.Mocked<any>

describe('useRecoilAggregateNodeValidation()', () => {
  it('should return validation data for the supplied paths', () => {
    function MockConsumer(){
      const validationData = useRecoilAggregateNodeValidation([ ['page'], ['page', 'title'] ])
      return <div>{validationData}</div>
    }
    when(validationDataStoreMock.getAll)
      .calledWith([ ['page'], ['page', 'title'] ])
      .mockReturnValueOnce('the-aggregate-validation-state')

    when(useRecoilValueMock)
      .calledWith('the-aggregate-validation-state')
      .mockReturnValueOnce('the-aggregate-validation-data')
    const { getByText } = render(<MockConsumer />)
    expect(getByText('the-aggregate-validation-data')).not.toBeNull()
  })
})

export {}