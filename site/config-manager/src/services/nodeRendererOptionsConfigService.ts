import { NodeConfig, NodeRendererRegistration, Service } from "@graphter/core";

import { nodeRendererStore } from "@graphter/renderer-react";

export const nodeRendererOptionsConfigService: Service = {
  list: (skip?: number, take?: number) => {
    skip = skip || 0
    const allTypeRendererRegistrations = nodeRendererStore.getAll()
    const optionsConfigs = allTypeRendererRegistrations
      .filter(reg => reg.optionsConfig)
      .map(reg => reg.optionsConfig as NodeConfig)
    take = take || allTypeRendererRegistrations.length

    return Promise.resolve({
      items: optionsConfigs.slice(skip, skip + take),
      count: 1,
      skip: 0,
      take: 10
    })
  },
  get: async (id: string | number) => {
    const nodeRendererRegistration = nodeRendererStore.getAll().find(config => config.type === id) || null
    return Promise.resolve({
      item: nodeRendererRegistration?.optionsConfig || null
    })
  },
  save: (id: string | number, data: any) => {
    throw new Error('Cannot save renderer options config yet')
  }
}