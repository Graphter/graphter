import { useRecoilValue } from 'recoil';
import {
  PathSegment,
} from '@graphter/core';
import validationDataStore from '../store/validationDataStore';
import { AggregateNodeValidationHook } from "@graphter/renderer-react";

export const useRecoilAggregateNodeValidation: AggregateNodeValidationHook = (
  paths: Array<Array<PathSegment>>
) => {
  const aggregateValidationState = validationDataStore.getAll(paths)
  return useRecoilValue(aggregateValidationState)
}