import { useRecoilValue } from "recoil";
import { nodeConfigsStore } from "../store/nodeConfigsStore";
import { NodeConfigsHook } from "@graphter/renderer-react";

/**
 * @param path
 */
export const useRecoilNodeConfigs: NodeConfigsHook = (
  path,
) => {

  const nodeConfigs = nodeConfigsStore.get(path)
  if(!nodeConfigs) throw new Error(`Missing configs state at '${path.join('/')}'`)

  return useRecoilValue(nodeConfigs)
}