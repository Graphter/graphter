import React, { Fragment } from 'react';
import s from './ExampleList.pcss';
import pageConfig from "../../models/page";
import ExampleListItem from "../example-list-item/ExampleListItem";
import { Pagination } from "@graphter/renderer-component-library-react";
import {Link, Route} from "react-router-dom";
import { ListRenderer } from "@graphter/renderer-react";
import { useLocation } from "react-router";
import querystring from 'query-string';
import cs from 'classnames'

export default function ExampleList({}){
  const { search } = useLocation();
  let { page, size } = querystring.parse(search);
  page = parseInt(Array.isArray(page) ? page[0] : page) || 1;
  size = parseInt(Array.isArray(size) ? size[0] : size) || 10;
  return (
    <Fragment>
      <h1>Pages</h1>
      <ListRenderer
        config={pageConfig}
        renderItem={({ item }) => (
          <ExampleListItem item={item} page={page} size={size} subtextPath={['metadata']} />
        )}
        page={page}
        size={size}
        renderPagination={({ count }) => (
          <Pagination
            page={page}
            size={size}
            count={count}
            renderPageItem={({ isCurrent, page, size}) => {
              return isCurrent ? (
                <div
                  key={page}
                  className={cs(s.page, s.current)}
                  data-testid='current-page'
                >{page}</div>
              ) : (
                <Link
                  key={page}
                  to={`/pages?page=${page}&size=${size}`}
                  className={s.page}
                >{page}</Link>
              );
            }} />
        )}/>

    </Fragment>
  )
}