import StringNodeRenderer from "./StringNodeRenderer";
import { NodeRendererRegistration } from "@graphter/core";
import { JsonType } from "@graphter/core";

export interface StringNodeRendererOptions {
  type: string
}

export function registerStringNodeRenderer(options?: StringNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'string',
    jsonType: JsonType.STRING,
    getRenderedData: async (path, getNodeValue) => {
      return await getNodeValue(path)
    },
    renderer: StringNodeRenderer,
    options
  }
}