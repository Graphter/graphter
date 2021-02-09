/**
 * This is a good candidate for promotion to a core package. Still some questions to answer:
 * - Should the data accessed by this renderer also be defined by a configuration?
 * - Can we do better with options typing? Does it have to be type 'any' or can we get some compile-time safety?
 *
 * Summary: wait until more battle tested before promotion
 */
import React, { ComponentType, useEffect, useMemo, useState } from "react";
import { NodeRendererProps } from "@graphter/core";
import { createDefault, useNodeData, useNodeValidation } from "@graphter/renderer-react";
import s from './DataSelectNodeRenderer.module.css'
import { useService } from "@graphter/renderer-react";
import { pathUtils } from "@graphter/renderer-react";
import { getValue } from "@graphter/renderer-react";
import { setupNodeRenderer } from "@graphter/renderer-react";

const DataSelectNodeRenderer: ComponentType<NodeRendererProps> = setupNodeRenderer((
  {
    config,
    originalNodeData,
    committed = true,
    path
  }: NodeRendererProps
) => {
  if(!config.options?.service) throw new Error('Data select renderer requires a service ID')
  const keyPathValidation = pathUtils.validate(config.options?.keyPath)
  if(!keyPathValidation.valid) throw new Error(`Invalid key path: ${keyPathValidation.reason}`)
  const valuePathValidation = pathUtils.validate(config.options?.valuePath)
  if(!valuePathValidation.valid) throw new Error(`Invalid value path: ${valuePathValidation.reason}`)

  const isNew = typeof originalNodeData === 'undefined'
  if(isNew) originalNodeData = createDefault(config, '')
  const [ touched, setTouched ] = useState(false)
  const [ nodeData, setNodeData ] = useNodeData(path, config, originalNodeData, committed)
  const validationResults = useNodeValidation(config, path)
  const dataService = useService(config.options?.service)
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