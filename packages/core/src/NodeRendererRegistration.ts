import { ComponentType } from "react";
import { NodeRendererProps } from "./NodeRendererProps";
import { JsonType } from "./JsonType";
import { PathSegment } from "./PathSegment";

export interface NodeRendererRegistration {
  type: string;
  jsonType: JsonType
  getRenderedData: GetRenderedDataFn
  getPaths?: (
    path: Array<PathSegment>,
    getNodeValue: <T>(path: Array<PathSegment>) => Promise<T>
  ) => Promise<Array<Array<PathSegment>>>
  renderer: ComponentType<NodeRendererProps>;
  options?: any;
}

export interface GetRenderedDataFn {
  (
    path: Array<PathSegment>,
    getNodeValue: <T>(path: Array<PathSegment>) => Promise<T>
  ): Promise<any>
}