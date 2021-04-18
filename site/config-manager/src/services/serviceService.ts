import { PathSegment, Service } from "@graphter/core";
import { serviceStore } from "@graphter/renderer-react";

const serviceMap: Map<string, Service> = serviceStore.getMap()

export const serviceService: Service = {
  list: (skip?: number, take?: number) => {
    skip = skip || 0
    take = take || serviceMap.size
    return Promise.resolve({
      items: Array.from(serviceMap.keys())
        .slice(skip, take + skip)
        .map(key => ({ id: key })),
      count: 1,
      skip: 0,
      take: 10
    })
  },
  get: async (id: PathSegment) => {
    return Promise.resolve({
      item: id || null
    })
  },
}