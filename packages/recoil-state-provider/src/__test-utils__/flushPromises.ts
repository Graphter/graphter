import { act } from "@testing-library/react";

export default async function flushPromises() {
  return act(async () => {
    return new Promise(resolve => setImmediate(resolve));
  })
}