import { NodeRendererProps } from "@graphter/core";
import React, { useEffect } from "react";
import { ComponentType } from "react";

export const setupNodeRenderer = (NodeRenderer: ComponentType<NodeRendererProps>):
  ComponentType<NodeRendererProps> =>
{
  return (nodeRendererProps: NodeRendererProps) => {
    useEffect(() => {
      return () => {

      }
    })
    return <NodeRenderer {...nodeRendererProps} />
  }
}