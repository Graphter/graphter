import { PathSegment } from "@graphter/core";


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

export const getValue = (data: any, path?: Array<PathSegment> | null, defaultVal?: any) => {
  const targetData = path?.reduce((data: any, pathSegment: PathSegment) => {
    if(typeof data !== 'undefined') return data[pathSegment]
  }, data)
  if(typeof targetData === 'undefined'){
    if(typeof defaultVal === 'undefined')
      throw new Error(`Could not find a value at ${path?.join('/')} within: ${JSON.stringify(data)} and no default value was given.`)
    else return defaultVal
  }
  return targetData
}

export const pathUtils = {
  validate,
  getValue
}