import React from 'react';

import s from './ExampleListItem.pcss';
import { ListItemRenderer } from "@graphter/renderer-component-library-react";
import { Link } from "react-router-dom";

export default function ExampleListItem({ item, page, size }){
  return (
    <Link to={`/page/${item.id}?page=${page}&size=${size}`} className={s.listItem}>
      <ListItemRenderer item={item} />
    </Link>
  )
}