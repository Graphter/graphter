import { useRecoilValue } from "recoil";
import {
  NodeValidatorRegistration,
  PathSegment,
} from "@graphter/core";
import validationDataStore from "../store/validationDataStore";
import { AggregateNodeValidationHook } from "./AggregateNodeValidationHook";

export const useRecoilAggregateNodeValidation: AggregateNodeValidationHook = (
  paths: Array<Array<PathSegment>>
) => {
  if(!paths.length) throw new Error('paths argument must be supplied')

  const aggregateValidationState = validationDataStore.getAll(paths)
  return useRecoilValue(aggregateValidationState)
}