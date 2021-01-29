import { NodeRendererRegistration, Service } from "@graphter/core";

import { nodeRendererStore } from "@graphter/renderer-react";

export const nodeRendererService: Service = {
  list: (skip?: number, take?: number) => {
    skip = skip || 0
    const allTypeRenderers = nodeRendererStore.getAll()
    take = take || allTypeRenderers.length
    return Promise.resolve({
      items: allTypeRenderers.slice(skip, skip + take),
      count: 1,
      skip: 0,
      take: 10
    })
  },
  get: async (id: string | number) => {
    const item = nodeRendererStore.getAll().find(config => config.type === id) || null
    return Promise.resolve({
      item
    })
  },
  save: (id: string | number, data: any) => {
    throw new Error('Cannot save renderers yet')
  }
}