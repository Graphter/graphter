import { NodeValidation } from "./NodeValidation";

export interface NodeConfig {
  id: string
  name?: string
  type: string
  description?: string
  validation?: NodeValidation | Array<NodeValidation>
  identifier?: boolean
  default?: any | Function
  options?: any
  children?: Array<NodeConfig>
}