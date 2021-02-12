import { PathSegment } from "@graphter/core";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import s from './Breadcrumb.module.css'
import { pathUtils } from "@graphter/renderer-react";

interface BreadcrumbProps {
  path: Array<PathSegment>
}
const Breadcrumb = ({ path }: BreadcrumbProps) => {
  return (
    <div className={s.breadcrumb}>
      {(path.reduce<{ current: Array<PathSegment>, crumbs: Array<ReactNode> }>(
        (a, c) => {
          a.current.push(c)
          a.crumbs.push(
            <Link key={a.current.join('/')} to={pathUtils.toUrl(a.current)}>
              {c}
            </Link>
          )
          return a
        }, { current: [], crumbs: [] })).crumbs}
    </div>
  )
}
export default Breadcrumb