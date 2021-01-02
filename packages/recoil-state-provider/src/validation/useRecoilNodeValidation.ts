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
import { propDataStore } from "../store/propDataStore";
import validationDataStore from "../store/validationDataStore";
import { NodeValidationData, NodeValidationHook } from "@graphter/renderer-react";
import { pathConfigStore } from "@graphter/renderer-react";

export const useRecoilNodeValidation: NodeValidationHook = (
  path: Array<PathSegment>,
  validatorRegistry: Array<NodeValidatorRegistration>
) => {
  const validationData: NodeValidationData = {
    path,
    results: [],
  }
  if(!propDataStore.has(path)) return validationData
  const propDataState = propDataStore.get(path)
  const propData = useRecoilValue(propDataState)
  validationData.value = propData
  const config = pathConfigStore.get(path)
  if(!config) throw new Error(`Couldn't find config for node at path '${path.join('/')}' for validation`)
  validationData.config = config
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

  if(!onChangeValidators) return validationData

  if(!validationDataStore.has(path)){
    validationDataStore.set(path, config, propData, [])
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
          value: propData,
          results: flattenedValidationResults
        })
      })()
    }
  }, [ propData ])

  return nodeValidationData
}