import { NewGetChildPathsFn } from "@graphter/core";

export const newGetNestedChildPaths: NewGetChildPathsFn = (config, path) => {
  return [ [ ...path ] ]
}