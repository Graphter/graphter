import { GetResult, PathSegment, Service } from "@graphter/core";

import pageConfig from '../models/page'

const configs: GetResult[] = [
  {
    item: {
      id: 'page',
      name: 'Page'
    },
    version: 1
  },
  {
    item: {
      id: 'author',
      name: 'Author'
    },
    version: 2
  }
]


export const configService: Service =  {
  list: (skip: number, take: number) => {
    return Promise.resolve({
      items: configs.map(config => config.item),
      count: 1,
      skip: 0,
      take: 10
    })
  },
  get: async (id: string | number) => {
    return Promise.resolve(configs.find(config => config.item.id === id) || {
      item: null
    })
  },
  save: (id: string | number, data: any) => {
    throw new Error('Cannot save config yet')
  }
}