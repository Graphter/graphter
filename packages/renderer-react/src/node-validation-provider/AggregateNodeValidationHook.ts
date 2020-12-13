import NodeValidationData from "./NodeValidationData";
import { PathSegment } from "@graphter/core";

export interface AggregateNodeValidationHook {
  (
    paths: Array<Array<PathSegment>>,
  ): Array<NodeValidationData>
}