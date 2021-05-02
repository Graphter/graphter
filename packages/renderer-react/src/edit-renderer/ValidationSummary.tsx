import React  from 'react';
import { NodeConfig, PathSegment } from "@graphter/core";

export interface ValidationSummaryProps {
  config: NodeConfig,
  path: Array<PathSegment>
}

export default function ValidationSummary({ config, path }: ValidationSummaryProps){
  // TODO: Redo
  // const treeMeta = useTreeMeta(config, path)
  // const treePaths = treeMeta.reduce<Array<Array<PathSegment>>>((a, c) => {
  //   a.push(c.path)
  //   return a
  // }, [])
  // const aggregatedValidationData = useAggregateNodeValidation(treePaths)
  // const someErrors = aggregatedValidationData
  //   .some(validationData => validationData.results
  //     .some(validationResult => !validationResult.valid))
  // if(!someErrors) return null
  //
  // return (
  //   <div className='mb-10'>
  //     {aggregatedValidationData.map((validationData, i) => {
  //       return (
  //         <div key={i}>
  //           {validationData.results.map((result, i) => {
  //             if(result.valid) return null
  //             return (
  //               <div key={i}>{validationData.path.join('/')}: {result.errorMessage}</div>
  //             )
  //           })}
  //         </div>
  //       )
  //     })}
  //   </div>
  // )
  return <div>Validation summary (TODO)</div>
}