import { ReactNode } from "react";
import {PaginationPageProps} from "./PaginationPageProps";

export interface PaginationProps {
  page: number
  size: number
  count: number,
  renderPageItem: (props: PaginationPageProps) => ReactNode
}