import { useRecoilAggregateNodeValidation } from "./useRecoilAggregateNodeValidation";
import { useRecoilValue } from 'recoil'
import validationDataStore from "../store/validationDataStore";

jest.mock('recoil')
jest.mock('../store/validationDataStore')

const useRecoilValueMock = useRecoilValue as jest.Mock<any>

describe('useRecoilAggregateNodeValidation()', () => {

})

export {}