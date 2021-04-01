import { pathUtils } from "../util/path";
import { createDefault } from "../util/node";
import { InitialiseNodeDataFn } from "@graphter/core";

export const createValueInitialiser = (fallbackValue: any): InitialiseNodeDataFn =>
  (config, path, initialise, originalTreeData) => {
    initialise(path, pathUtils.getValue(originalTreeData, path.slice(2), createDefault(config, fallbackValue)))
  }