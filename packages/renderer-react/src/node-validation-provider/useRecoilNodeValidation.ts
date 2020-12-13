import propDataStore from "../store/propDataStore";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useMemo } from "react";
import {
  NodeValidator,
  NodeValidatorRegistration,
  PathSegment,
  ValidationExecutionStage,
  ValidationResult
} from "@graphter/core";
import { NodeValidation } from "@graphter/core";
import validationDataStore from "../store/validationDataStore";
import { NodeValidationHook } from "./NodeValidationHook";

export const useRecoilNodeValidation: NodeValidationHook = (
  path: Array<PathSegment>,
  validatorRegistry: Array<NodeValidatorRegistration>
) => {
  if(!propDataStore.has(path)) return []
  const propDataState = propDataStore.get(path)
  if(!propDataState) return []
  const propData = useRecoilValue(propDataState)
  const config = propDataStore.getConfig(path)

  const onChangeValidators = useMemo(() => {
    if(!config.validation) return null
    let validations:Array<NodeValidation> = Array.isArray(config.validation) ? config.validation : [ config.validation ]
    return validations.flatMap<NodeValidator>(validation => {
      if(!validation.executeOn.includes(ValidationExecutionStage.CHANGE)) return []
      const registration = validatorRegistry.find(validator => validator.type === validation.type)
      if(!registration) return []
      return [registration.validatorSetup(validation.options)]
    })
  }, [ config ])

  if(!onChangeValidators) return []

  if(!validationDataStore.has(path)){
    validationDataStore.set(path, config, [])
  }
  const validationState = validationDataStore.get(path)
  const [ nodeValidationData, setNodeValidationData ] = useRecoilState(validationState)

  useEffect(() => {
    if(onChangeValidators) {
      (async () => {
        const results = await Promise.all(onChangeValidators.map(validator => {
          if(validator) {
            return validator(
              ValidationExecutionStage.CHANGE,
              config,
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
          config,
          results: flattenedValidationResults
        })
      })()
    }
  }, [ propData ])

  return nodeValidationData.results
}

export default useRecoilNodeValidation