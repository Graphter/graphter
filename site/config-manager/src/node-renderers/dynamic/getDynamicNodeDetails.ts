import { NodeConfig, NodeRendererRegistration, PathSegment, Service } from "@graphter/core";
import { isDynamicConfig } from "./isDynamicConfig";
import { nodeRendererStore } from "@graphter/renderer-react";

export const getDynamicNodeDetails = async (
  globalPath: Array<PathSegment>,
  config: NodeConfig,
  configService: Service,
  getNodeValue: (path: Array<PathSegment>) => any
): Promise<[ NodeConfig | null, NodeRendererRegistration | null ]> => {
  if(!isDynamicConfig(config)) throw new Error('Invalid DynamicNodeRenderer config')
  const targetGlobalPath = [...globalPath.slice(0, -1), ...config.options.siblingPath]
  const targetNodeData = getNodeValue(targetGlobalPath)
  const targetNodeDataType = typeof targetNodeData
  if(targetNodeDataType === 'undefined' || targetNodeData === null) return [ null, null ]
  const dynamicConfigResult = await configService.get(targetNodeData)
  if(!dynamicConfigResult.item) return [ null, null ]
  const dynamicRendererReg = nodeRendererStore.get(dynamicConfigResult.item.type)
  if(!dynamicRendererReg) return [ dynamicConfigResult.item, null ]
  return [ dynamicConfigResult.item, dynamicRendererReg ]
}