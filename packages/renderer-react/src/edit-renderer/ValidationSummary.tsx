import React from 'react';
import s from './ValidationSummary.pcss';
import { PathSegment } from "@graphter/core";
import modelDataStore from "../store/modelDataStore";
import { useAggregateNodeValidation } from "../node-validation-provider/NodeValidationProvider";
import { useRecoilValue } from "recoil";

export interface ValidationSummaryProps {
  path: Array<PathSegment>
}

export default function ValidationSummary({ path }: ValidationSummaryProps){
  const descendentPathsState = modelDataStore.getDescendentPaths(path)
  const descendentPaths = useRecoilValue(descendentPathsState)
  const aggregatedValidationData = useAggregateNodeValidation(descendentPaths)
  return (
    <div className={s.validationSummary}>
      {aggregatedValidationData.map((validationData, i) => {
        return (
          <div key={i}>
            {validationData.results.map((result, i) => {
              return (
                <div key={i}>{result.errorMessage}</div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}