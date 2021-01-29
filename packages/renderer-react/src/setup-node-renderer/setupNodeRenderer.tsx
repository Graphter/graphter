import { NodeRendererProps } from "@graphter/core";
import React, { useEffect } from "react";
import { ComponentType } from "react";
import pathConfigStore from "../store/pathConfigStore";

export const setupNodeRenderer = (NodeRenderer: ComponentType<NodeRendererProps>):
  ComponentType<NodeRendererProps> =>
{
  return (nodeRendererProps: NodeRendererProps) => {
    useEffect(() => {
      return () => {

      }
    })
    pathConfigStore.set(nodeRendererProps.path, nodeRendererProps.config)
    return <NodeRenderer {...nodeRendererProps} />
  }
}