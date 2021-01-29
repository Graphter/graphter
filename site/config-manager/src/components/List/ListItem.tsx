import React from 'react';

import s from './ListItem.module.css';
import { ListItemRenderer } from "@graphter/renderer-component-library-react";
import { Link } from "react-router-dom";
import { PathSegment } from "@graphter/core";

export default function ExampleListItem({ item, page, size, titlePath, subtextPath }: {
  item: any,
  page: number,
  size: number,
  titlePath?: Array<PathSegment>,
  subtextPath?: Array<PathSegment>
}){
  return (
    <Link to={`/${item.id}?page=${page}&size=${size}`} className={s.listItem}>
      <ListItemRenderer item={item} titlePath={titlePath} subtextPath={subtextPath} />
    </Link>
  )
}