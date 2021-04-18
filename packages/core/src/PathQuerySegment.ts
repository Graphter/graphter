import { PathSegment } from "./PathSegment";

export type PathQuerySegment =
  PathSegment |
  { $up: number }