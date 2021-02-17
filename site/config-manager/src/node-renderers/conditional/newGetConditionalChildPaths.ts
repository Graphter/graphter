import { NewGetChildPathsFn } from "@graphter/core";

export const newGetConditionalChildPaths: NewGetChildPathsFn = (config, path, getNodeValue) => {

  return [ [ ...path ] ]
}