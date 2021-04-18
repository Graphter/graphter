import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { PathSegment } from '@graphter/core';
import treeDataStore from '../store/treeDataStore';
import { TreePathsHook } from '@graphter/renderer-react';

export const useRecoilTreePaths:TreePathsHook = (config, path) => {
  return useRecoilValue<Array<Array<PathSegment>>>(treeDataStore.getBranchPaths(config, path))
}