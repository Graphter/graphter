import { NodeConfig, Service } from "@graphter/core";

const configs: NodeConfig[] = [
  {
    id: 'page',
    name: 'Page',
    type: 'object'
  },
  {
    id: 'author',
    name: 'Author',
    type: 'string'
  }
]

export const configService: Service = {
  list: (skip?: number, take?: number) => {
    skip = skip || 0
    take = take || configs.length
    return Promise.resolve({
      items: configs.slice(skip, take + skip),
      count: 1,
      skip: 0,
      take: 10
    })
  },
  get: async (id: string | number) => {
    return Promise.resolve({
      item: configs.find(config => config.id === id) || null
    })
  },
  save: (id: string | number, data: any) => {
    throw new Error('Cannot save config yet')
  }
}