import { GetResult, ListResult, SaveResult, Service } from "@graphter/core";

import pageConfig from '../models/page'

export const configService: Service =  {
  list: (modelId: string, skip: number, take: number) => {
    return Promise.resolve({
      items: [
        pageConfig
      ],
      count: 1,
      skip: 0,
      take: 10
    })
  },
  get: (modelId: string, instanceId: string | number) => {
    if(instanceId !== 'page') return Promise.resolve({
      item: null
    })
    return Promise.resolve({
      item: pageConfig,
      version: 1
    })
  },
  save: (modelId: string, instance: any) => {
    throw new Error('Cannot save config yet')
  }
}