import { NodeRendererRegistration } from "./NodeRendererRegistration";

export interface NodeRendererStore {
  register: (registration: NodeRendererRegistration) => void
  registerAll: (registrations: Array<NodeRendererRegistration>) => void
  get: (nodeType: string) => NodeRendererRegistration
  getAll: () => NodeRendererRegistration[]
}