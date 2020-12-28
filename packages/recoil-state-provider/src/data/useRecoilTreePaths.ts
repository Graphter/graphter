import { useRecoilValueLoadable } from 'recoil';
import { PathSegment } from '@graphter/core';
import treeDataStore from '../store/treeDataStore';
import { TreePathsHook } from '@graphter/renderer-react';

export const useRecoilTreePaths:TreePathsHook = (path: Array<PathSegment>) => {
  const loadable = useRecoilValueLoadable<Array<Array<PathSegment>>>(treeDataStore.getDescendentPaths(path))
  return loadable.state === 'hasValue' ? loadable.contents : []
}