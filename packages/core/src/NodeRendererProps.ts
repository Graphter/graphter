import {
  NodeConfig,
  ErrorRendererProps, PathSegment
} from "./";
import { ComponentType } from "react";

export interface NodeRendererProps {
  config: NodeConfig
  configAncestry: Array<NodeConfig>
  originalNodeData?: any
  originalNodeDataAncestry: Array<any>
  /**
   * Used by a node renderer to indicate a completion action.
   * Can be used to add an item to or update an item in a list for example.
   */
  done?: () => void
  options?: any
  /**
   * Track new items in an enumerable before they're added
   */
  committed: boolean
  /**
   * To track current location in graph
   */
  path: Array<PathSegment>

  ErrorDisplayComponent?: ComponentType<ErrorRendererProps>
}