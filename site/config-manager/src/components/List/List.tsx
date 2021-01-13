import { ListRenderer } from "@graphter/renderer-react";
import React from "react";
import configConfig from '../../models/config'
import ListItem from "./ListItem";
import querystring from 'query-string';
import { useLocation } from "react-router";
import { Pagination } from "@graphter/renderer-component-library-react";
import cs from 'classnames'
import { Link } from "react-router-dom";
import s from './List.module.css'
import { useListing } from "@graphter/renderer-react";

export default function List(){
  const { search } = useLocation();
  let query = querystring.parse(search);

  const page = query.page === null ? 0 : parseInt(Array.isArray(query.page) ? query.page[0] : query.page) || 1;
  const size = query.size === null ? 10 : parseInt(Array.isArray(query.size) ? query.size[0] : query.size) || 10;

  const {
    items,
    loading,
    count,
    error
  } = useListing(configConfig, page, size)

  return (
    <ListRenderer
      config={configConfig}
      renderItem={({ item }) => (
        <ListItem item={item} page={page} size={size} subtextPath={['metadata']} />
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
  )
}