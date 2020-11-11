import propDataStore from "../store/propDataStore";
import { useRecoilValue } from "recoil";
import { useEffect, useMemo, useState } from "react";
import { NodeValidatorRegistration, PathSegment, ValidationExecutionStage, ValidationResult } from "@graphter/core";
import { NodeValidation } from "@graphter/core";
import { NodeValidationHook } from "./NodeValidationProvider";

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
    return validations
      .filter(validation => validation.executeOn.includes(ValidationExecutionStage.CHANGE))
      .map(validation => validatorRegistry.find(validator => validator.type === validation.type)?.validatorSetup(validation.options))
  }, [ config ])

  const [ validationResults, setValidationResults ] = useState<Array<ValidationResult>>([])

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
        setValidationResults(flattenedValidationResults)
      })()
    }
  }, [ propData ])

  return validationResults
}

export default useRecoilNodeValidation