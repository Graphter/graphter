/**
 * This is a good candidate for promotion to a core package. Still some questions to answer:
 * - Should the data accessed by this renderer also be defined by a configuration?
 * - Can we do better with options typing? Does it have to be type 'any' or can we get some compile-time safety?
 *
 * Summary: wait until more battle tested before promotion
 */
import React, { ComponentType, useEffect, useMemo, useState } from "react";
import { NodeRendererProps } from "@graphter/core";
import { useNodeData, useNodeValidation } from "@graphter/renderer-react";
import s from './DataSelectNodeRenderer.module.css'
import { pathUtils } from "@graphter/renderer-react";
import { getValue } from "@graphter/renderer-react";
import { setupNodeRenderer } from "@graphter/renderer-react";
import { serviceStore } from "@graphter/renderer-react";
import { isDataSelectNodeConfig } from "./isDataSelectNodeConfig";

const DataSelectNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    globalPath
  }: NodeRendererProps
) => {
  if(!isDataSelectNodeConfig(config)) throw new Error('Invalid DataSelectNodeRenderer config')
  const keyPathValidation = pathUtils.validate(config.options?.keyPath)
  if(!keyPathValidation.valid) throw new Error(`Invalid key path: ${keyPathValidation.reason}`)
  const valuePathValidation = pathUtils.validate(config.options?.valuePath)
  if(!valuePathValidation.valid) throw new Error(`Invalid value path: ${valuePathValidation.reason}`)
  const [ touched, setTouched ] = useState(false)
  const [ nodeData, setNodeData ] = useNodeData<string>(globalPath)
  const validationResults = useNodeValidation(config, globalPath)
  const dataService = serviceStore.get(config.options?.serviceId)
  const [ options, setOptions ] = useState<Array<{ [key: string]: string}> | null>(null)
  const [ loading, setLoading ] = useState(true)
  useEffect(() => {
    (async () => {
      const options = (await dataService.list()).items
        .map((item: any) => ({
          key: getValue(item, config.options?.keyPath),
          value: getValue(item, config.options?.valuePath)
        }))
      setOptions(options)
      setLoading(false)
    })()
  }, [])

  return (
    <>
      <select
        onChange={(e) => {
          const value = e.currentTarget.value
          if(value !== 'loading'){
            setNodeData && setNodeData(value)
            setTouched(true)
          }
        }}
        value={loading ? 'loading' : nodeData}
        className='flex-grow p-3 rounded'
      >
        {loading && (
          <option disabled value='loading'>Loading...</option>
        )}
        {options && options.map(option => {
          return (
            <option key={option.key} value={option.key}>{option.value}</option>
          )
        })}
      </select>
      {touched &&
      validationResults &&
      validationResults.value === nodeData &&
      validationResults.results.map((result, i) => (
        result.valid ? null : (
          <div className={s.error} key={i} data-testid='validation-error'>
            {result.errorMessage}
          </div>
        )
      ))}
    </>
  )
})

export default DataSelectNodeRenderer