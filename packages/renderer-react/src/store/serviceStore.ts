import { Service } from "@graphter/core";

const serviceMap: { [key: string]: Service } = {};

const register = (serviceId: string, service: Service) => {
  serviceMap[serviceId] = service
}
const get = (serviceId: string): Service => {
  let registration = serviceMap[serviceId]
  if(!registration) {
    console.warn(`No '${serviceId}' service has been registered. Moving on...`)
  }
  return registration
}
export const serviceStore = {
  register,
  get,
}

export default serviceStore