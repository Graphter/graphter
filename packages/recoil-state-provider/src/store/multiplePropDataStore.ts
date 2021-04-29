import { RecoilValueReadOnly, selector } from "recoil";
import { PathSegment } from "@graphter/core";
import { propDataStore } from "./propDataStore";

const multiplePropDataMap: Map<string, RecoilValueReadOnly<any>> = new Map()
const keySalt = '5042b962-fd6c-470c-bbae-747380814365'
const get = (paths: Array<Array<PathSegment>>): RecoilValueReadOnly<Array<{ path: Array<PathSegment>, data: any }>> => {
  const key = paths.map(path => path.join(keySalt)).join('-')
  if(!multiplePropDataMap.has(key)){
    multiplePropDataMap.set(key, selector<Array<{ path: Array<PathSegment>, data: any }>>({
      key: key,
      get: ({ get }) => {
        return paths.map(path => {
          const state = propDataStore.get(path)
          if(!state) throw new Error(`Missing state for ${path.join('/')}'`)
          const pathMeta = get(state)
          return {
            path,
            data: pathMeta
          }
        })
      }
    }))
  }
  const state = multiplePropDataMap.get(key)
  if(!state) throw new Error(`Error gathering state for paths: ${paths.map(path => path.join('/')).join(' - ')}`)
  return state
}

const multiplePropDataStore = {
  get
}

export default multiplePropDataStore