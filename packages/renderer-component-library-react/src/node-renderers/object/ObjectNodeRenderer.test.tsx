import React from 'react'
import ObjectNodeRenderer from "./ObjectNodeRenderer";
import { render } from "@testing-library/react";
import * as graphterRenderer from "@graphter/renderer-react";
import clone from "rfdc";

const useNodeDataMock = graphterRenderer.useNodeData as jest.Mock<any>
const nodeRendererStoreGetMock = graphterRenderer.nodeRendererStore.get as jest.Mock<any>
const createDefaultMock = graphterRenderer.createDefault as jest.Mock<any>

describe('<ObjectNodeRenderer />', () => {
  it('render correctly', () => {
    const { container } = render(<ObjectNodeRenderer
      originalNodeData={{}}
      originalNodeDataAncestry={[]}
      committed={true}
      config={{
        id: 'author',
        name: 'Author',
        description: 'An author',
        type: 'object',
        children: [
          {
            id: 'name',
            name: 'Name',
            type: 'string'
          },
          {
            id: 'location',
            name: 'Location',
            type: 'string'
          },
        ]
      }}
      configAncestry={[]}
      path={['/']} /> )
    expect(container).toMatchSnapshot()
  })
  it('should render default data when new', () => {
    createDefaultMock.mockReturnValue({})
    const config = {
      id: 'author',
      name: 'Author',
      description: 'An author',
      type: 'object',
      children: [
        {
          id: 'name',
          name: 'Name',
          type: 'string'
        }
      ]
    }
    render(<ObjectNodeRenderer
      config={clone()(config)}
      configAncestry={[]}
      originalNodeData={undefined}
      originalNodeDataAncestry={[]}
      committed={true}
      path={[ '/' ]}
    />);
    expect(createDefaultMock).toHaveBeenCalledWith(config, {})
    expect(useNodeDataMock).toHaveBeenCalledWith([ '/' ], config, {}, true)
  })
  it('should use the data provider for data', () => {
    const config = {
      id: 'name',
      name: 'Name',
      description: 'The name',
      type: 'list',
      children: [
        {
          id: 'name',
          name: 'Name',
          type: 'string'
        }
      ]
    }
    render(<ObjectNodeRenderer
      config={clone()(config)}
      configAncestry={[]}
      originalNodeData={[
        'item 1 value',
        'item 2 value'
      ]}
      originalNodeDataAncestry={[]}
      committed={true}
      path={[ '/' ]}
    />);
    expect(useNodeDataMock).toHaveBeenCalled()
  })
  it('should render child items with the correct renderers', () => {
    const config = {
      id: 'name',
      name: 'Name',
      description: 'The name',
      type: 'list',
      children: [
        {
          id: 'name',
          name: 'Name',
          type: 'string'
        }
      ]
    }
    render(<ObjectNodeRenderer
      config={clone()(config)}
      configAncestry={[]}
      originalNodeData={[
        'item 1 value',
        'item 2 value'
      ]}
      originalNodeDataAncestry={[]}
      committed={true}
      path={[ '/' ]}
    />);
    expect(nodeRendererStoreGetMock).toHaveBeenCalledWith('string')
  })
})

export {}