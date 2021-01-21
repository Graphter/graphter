import { NodeRendererRegistration, NodeRendererStore } from "@graphter/core";

const nodeRendererMap: { [key: string]: NodeRendererRegistration } = {};

const register = (registration: NodeRendererRegistration) => {
  nodeRendererMap[registration.type] = registration
}
const registerAll = (registrations: Array<NodeRendererRegistration>) => {
  if(!registrations) return
  registrations.forEach(registration => register(registration))
}
const get = (nodeType: string): NodeRendererRegistration => {
  let registration = nodeRendererMap[nodeType]
  if(!registration) {
    console.warn(`No '${nodeType}' node renderer has been registered. Moving on...`)
  }
  return registration
}
const getAll = (): NodeRendererRegistration[] => {
  return Object.entries(nodeRendererMap)
    .map(([, value]) => value)
}

export const nodeRendererStore: NodeRendererStore = {
  register,
  registerAll,
  get,
  getAll
}

export default nodeRendererStore