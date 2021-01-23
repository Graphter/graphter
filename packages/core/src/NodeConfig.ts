import { NodeValidation } from "./NodeValidation";

export interface NodeConfig {
  id: string
  name?: string
  type: string
  description?: string
  children?: Array<NodeConfig>
  identityPath?: Array<string>
  validation?: NodeValidation | Array<NodeValidation>
  identifier?: boolean
  default?: any | Function
  options?: any
}