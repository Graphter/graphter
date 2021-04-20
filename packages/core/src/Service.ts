import {ListResult} from "./ListResult";
import {GetResult} from "./GetResult";
import {SaveResult} from "./SaveResult";
import { PathSegment } from "./PathSegment";

export interface Service {
  list: (skip?: number, take?: number) => Promise<ListResult>,
  get: (id: PathSegment) => Promise<GetResult>,
  save?: (id: PathSegment, data: any) => Promise<SaveResult>
}