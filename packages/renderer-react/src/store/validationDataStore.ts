import { NodeConfig, PathSegment, ValidationResult } from "@graphter/core";
import { atom, RecoilState, RecoilValueReadOnly, selector } from "recoil";
import { nanoid } from "nanoid";
import NodeValidationData from "../node-validation-provider/NodeValidationData";

const validationStateMap: Map<string, RecoilState<NodeValidationData>> = new Map()
const pathSegmentKeySalt = '[be3cc399-9225-4cbc-9d23-6c0c69ddca4a]'
const aggregateValidationsStateMap: Map<string, RecoilValueReadOnly<Array<NodeValidationData>>> = new Map()
const pathKeySalt = '[c42e99e6-d234-4d4a-828f-f696b11c9683]'

const generateValidationKey = (path: Array<PathSegment>) => `validation-${path.join(pathSegmentKeySalt)}`

export const get = (path: Array<PathSegment>): RecoilState<NodeValidationData> => {
  const state = validationStateMap.get(generateValidationKey(path))
  if(!state) throw new Error(`No validation state for '${path.join('/')}' found in the store`)
  return state
}

export const has = (path: Array<PathSegment>): boolean => {
  return validationStateMap.has(generateValidationKey(path))
}

export const set = (
  path: Array<PathSegment>,
  config: NodeConfig,
  value: any,
  results: Array<ValidationResult>
) => {
  if(!path.length) throw new Error('path argument must have at least one element')
  const key = generateValidationKey(path)
  const validationData: NodeValidationData = {
    path,
    config,
    value,
    results
  }
  validationStateMap.set(key, atom({
    key: key,
    default: validationData
  }))
}

export const getAggregate = (paths: Array<Array<PathSegment>>): RecoilValueReadOnly<Array<NodeValidationData>> => {
  const key = `aggregate-validations-${paths.map(path => path.join(pathSegmentKeySalt)).join(pathKeySalt)}`
  if(aggregateValidationsStateMap.has(key)){
    const aggregateValidations = aggregateValidationsStateMap.get(key)
    if(!aggregateValidations) throw new Error('Could not find aggregate validation. Should never happen')
    return aggregateValidations
  }

  const aggregateValidations = selector<Array<NodeValidationData>>({
    key,
    get: (options) => {
      return paths.flatMap(path => {
        if(!has(path)) return []
        const validationDataState = get(path)
        const validationData = options.get(validationDataState)
        return [{
          path,
          config: validationData.config,
          results: validationData.results
        }]
      })
    }
  })
  aggregateValidationsStateMap.set(key, aggregateValidations)

  return aggregateValidations
}

export default {
  get,
  getAll: getAggregate,
  has,
  set
}