import { NodeRendererRegistration, NodeRendererStore } from "@graphter/core";

const nodeRendererMap: { [key: string]: NodeRendererRegistration } = {};

export const register = (registration: NodeRendererRegistration) => {
  nodeRendererMap[registration.type] = registration
}
export const registerAll = (registrations: Array<NodeRendererRegistration>) => {
  if(!registrations) return
  registrations.forEach(registration => register(registration))
}
export const get = (nodeType: string): NodeRendererRegistration => {
  let registration = nodeRendererMap[nodeType]
  if(!registration) {
    console.warn(`No '${nodeType}' node renderer has been registered. Moving on...`)
  }
  return registration
}

const nodeRendererStore: NodeRendererStore = {
  register,
  registerAll,
  get
}

export default nodeRendererStore