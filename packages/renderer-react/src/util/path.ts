import { PathSegment } from "@graphter/core";

export const pathUtils = {
  validate,
  getValue
}

export function validate(path?: Array<PathSegment> | null){
  if(typeof path === null || path === undefined) return {
    valid: false,
    reason: 'Path is empty'
  }
  if(!Array.isArray(path)) return {
    valid: false,
    reason: 'Path is not an array'
  }
  for(const segment of path) {
    switch (typeof segment) {
      case 'string':
        break
      case 'number':
        break
      default:
        return {
          valid: false,
          reason: `'${typeof segment}' is an invalid path segment`
        }
    }
  }
  return {
    valid: true
  }
}

export function getValue(data: any, path?: Array<PathSegment> | null, defaultVal?: any){
  if(!path || !path.length) return data
  let currentData = data
  const pathClone = [ ...path ]
  while(pathClone.length) {
    const segment = pathClone.shift()
    if(typeof segment === 'undefined') throw new Error('Undefined path segment')
    currentData = currentData[segment]
    if(typeof currentData === 'undefined'){
      if(defaultVal) return defaultVal
      else throw new Error(`Unable to get a value at [${pathClone.join('/')}] in 
      ${JSON.stringify(data, null, 2)} 
      and no default was specified`)
    }
  }
  return currentData
}