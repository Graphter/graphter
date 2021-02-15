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
    <div className='flex flex-row'>
      {(path.reduce<{ current: Array<PathSegment>, crumbs: Array<ReactNode> }>(
        (a, c) => {
          const key = a.current.join('/')
          a.current.push(c)
          a.crumbs.push(
            <Link
              key={key}
              to={pathUtils.toUrl(a.current)}
              className='px-2 py-1 bg-gray-200 hover:bg-gray-300 mr-2 rounded text-gray-600 transition-colours duration-200'
            >
              {c}
            </Link>
          )
          if(a.current.length !== path.length){
            a.crumbs.push(<svg key={`arrow-${key}`} className='w-4 fill-current text-gray-200 mr-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>)
          }
          return a
        }, { current: [], crumbs: [] })).crumbs}
    </div>
  )
}
export default Breadcrumb