import { NodeRendererRegistration } from "@graphter/core";
import React from "react";

export const nodeRendererStore = {
  get: jest.fn()
}

export const pathConfigStore = {
  get: jest.fn(),
  set: jest.fn()
}

export const NodeValidationProvider = jest.fn(({ children }: any) => <div>{children}</div>)
export const NodeDataProvider = jest.fn(({ children }: any) => <div>{children}</div>)