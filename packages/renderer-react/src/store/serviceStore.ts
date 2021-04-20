import { Service } from "@graphter/core";

const serviceMap: Map<string, Service> = new Map();

const register = (serviceId: string, service: Service) => {
  serviceMap.set(serviceId, service)
}

const has = (serviceId: string): boolean => {
  return serviceMap.has(serviceId)
}

const get = (serviceId: string): Service => {
  let registration = serviceMap.get(serviceId)
  if(!registration) {
    throw new Error(`No service with ID '${serviceId}' has been registered`)
  }
  return registration
}
const getAll = (): Array<Service> => {
  return Array.from(serviceMap.values())
}
export const serviceStore = {
  register,
  has,
  get,
  getAll,
  getMap: () => serviceMap
}

export default serviceStore