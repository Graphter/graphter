import React, { useState } from "react";
import { JsonType } from "@graphter/core";

export const useArrayNodeData = jest.fn(() => {
  return {
    childIds: [],
    removeItem: jest.fn(),
    commitItem: jest.fn()
  }
})

export const useNodeData = jest.fn(() => {
  return [
    null,
    () => {}
  ]
})

export const useNodeValidation = jest.fn().mockResolvedValue([])

export const nodeRendererStore = {
  get: jest.fn(() => ({
    type: 'string',
    jsonType: JsonType.STRING,
    renderer: ({originalNodeData}: any) => {
      const [ value, setValue ] = useState(originalNodeData || '')
      return (
        <input value={value} onChange={e => setValue(e.target.value)} data-testid='string-renderer' />
    )
    }
  }))
}
export const createDefault = jest.fn()