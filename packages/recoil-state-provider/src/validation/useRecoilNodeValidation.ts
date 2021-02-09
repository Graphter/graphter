import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useMemo } from "react";
import {
  NodeConfig,
  NodeValidator,
  NodeValidatorRegistration,
  PathSegment,
  ValidationExecutionStage,
  ValidationResult
} from "@graphter/core";
import { NodeValidation } from "@graphter/core";
import { propDataStore } from "../store/propDataStore";
import validationDataStore from "../store/validationDataStore";
import { NodeValidationData, NodeValidationHook } from "@graphter/renderer-react";

export const useRecoilNodeValidation: NodeValidationHook = (
  config: NodeConfig,
  path: Array<PathSegment>,
  validatorRegistry: Array<NodeValidatorRegistration>
) => {
  const validationData: NodeValidationData = {
    path,
    results: [],
  }
  const propDataState = propDataStore.get(path)
  const propData = useRecoilValue(propDataState)
  validationData.value = propData
  const onChangeValidators = getChangeValidators(config, validatorRegistry)

  if(!validationDataStore.has(path)){
    validationDataStore.set(path, propData, [])
  }
  const validationState = validationDataStore.get(path)
  const [ nodeValidationData, setNodeValidationData ] = useRecoilState(validationState)

  useEffect(() => {
    if(onChangeValidators && onChangeValidators.length) {
      (async () => {
        const results = await Promise.all(onChangeValidators.map(validator => {
          if(validator) {
            return validator(
              ValidationExecutionStage.CHANGE,
              config,
              path,
              propData
            )
          }
          return undefined
        }))
        const flattenedValidationResults = results.reduce<ValidationResult[]>((a, c) => {
          if (Array.isArray(c)) return a.concat(c)
          if(c !== undefined) a.push(c)
          return a
        }, [])
        setNodeValidationData({
          path,
          value: propData,
          results: flattenedValidationResults
        })
      })()
    }
  }, [ propData ])

  return nodeValidationData
}

function getChangeValidators(
  config: NodeConfig,
  validatorRegistry: Array<NodeValidatorRegistration>
){
  return useMemo(() => {
    if(!config.validation) return null
    let validations:Array<NodeValidation> = Array.isArray(config.validation) ? config.validation : [ config.validation ]
    return validations.flatMap<NodeValidator>(validation => {
      if(!validation.executeOn.includes(ValidationExecutionStage.CHANGE)) return []
      const registration = validatorRegistry.find(validator => validator.type === validation.type)
      if(!registration) return []
      return [ registration.validatorSetup(validation.options) ]
    })
  }, [ config ])
}