import { PathSegment } from "@graphter/core";
import { PathQuerySegment } from "@graphter/core";

export function validate(path?: Array<PathSegment> | null) {
  if (typeof path === null || path === undefined) return {
    valid: false,
    reason: 'Path is empty'
  }
  if (!Array.isArray(path)) return {
    valid: false,
    reason: 'Path is not an array'
  }
  for (const segment of path) {
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

export const getValueByLocalPath = (data: any, localPath?: Array<PathSegment> | null, defaultVal?: any) => {
  const targetData = localPath?.reduce((data: any, pathSegment: PathSegment) => {
    if (typeof data !== 'undefined') return data[pathSegment]
  }, data)
  if (typeof targetData === 'undefined') {
    if (typeof defaultVal === 'undefined')
      throw new Error(`Could not find a value at ${localPath?.join('/')} within: ${JSON.stringify(data)} and no default value was given.`)
    else return defaultVal
  }
  return targetData
}

export const getValueByGlobalPath = (data: any, globalPath?: Array<PathSegment> | null, defaultVal?: any) => {
  return getValueByLocalPath(data, globalPath?.slice(2), defaultVal)
}

const safeNumberStringSalt = 'f3b1856b-59ee-4fe3-8538-ffee42ad7245'

export const toUrl = (path: Array<PathSegment>): string => {
  return `/${path
    .map((segment: number | string) => {
      if (typeof segment === 'number') return segment
      if (!isNaN(parseInt(segment))) return `${segment}-${safeNumberStringSalt}`
      return segment
    })
    .map(encodeURIComponent)
    .join('/')}`
}

export const fromUrl = (url: string): Array<PathSegment> => {
  return url
    .split('/')
    .filter(segment => segment)
    .map(decodeURIComponent)
    .map((segment) => {
      const numberSegment = parseInt(segment)
      if (!isNaN(numberSegment)) return numberSegment
      return segment
    })
}

export const valueToLocalPaths = (value: any): Array<Array<PathSegment>> => {

  function getChildPaths(value: any, parentPath: Array<PathSegment>): Array<Array<PathSegment>> {
    if(value === null) return []
    else if (Array.isArray(value)) return value
      .map((item, i) => {
        const childPath = [ ...parentPath, i ]
        return [ childPath, ...getChildPaths(item, childPath) ]
      })
      .flat()
    else if (typeof value === 'object') return Object.entries(value)
      .map(([ k, v ]) => {
        const childPath = [ ...parentPath, k ]
        return [ childPath, ...getChildPaths(v, childPath) ]
      })
      .flat()
    else return []
  }

  return [ [], ...getChildPaths(value, []) ]
}

export const resolvePaths = (startPath: Array<PathSegment>, queryPath: Array<PathQuerySegment>, data: any) => {
  let currentPath = [ ...startPath ]
  for(let navSegment of queryPath){
    switch(typeof navSegment){
      case 'string':
      case 'number':
        currentPath.push(navSegment)
        continue
      case 'object':
        if(navSegment.hasOwnProperty('$up')){
          const levels = navSegment['$up']
          if(levels < 0) throw new Error(`$up navigation segment must have a value of 1 or more but found '${levels}'`)
          currentPath = currentPath.slice(0, -levels)
        }
    }
  }
  return [ currentPath ]
}

export const queryPathToString = (queryPath: Array<PathQuerySegment>) => {
  return queryPath
    .map(querySegment => {
      return typeof querySegment === 'object' ?
        JSON.stringify(querySegment) : querySegment
    })
    .join('/')
}

export const pathToKey = (path: Array<PathSegment>) => path.join('[88484d0d-33e8-47b4-a351-7bb581268da3]')

export const pathUtils = {
  toUrl,
  fromUrl,
  validate,
  getValueByGlobalPath,
  getValueByLocalPath,
  valueToLocalPaths,
  resolvePaths,
  queryPathToString,
  pathToKey
}