import React from "react";
import { act, render, fireEvent, within, queryAllByTestId } from '@testing-library/react';
import * as graphterRenderer from "@graphter/renderer-react";
import ListNodeRenderer from "./ListNodeRenderer";
import clone from 'rfdc'
import { when } from "jest-when";

const useArrayNodeDataMock = graphterRenderer.useArrayNodeData as jest.Mock<any>
const nodeRendererStoreGetMock = graphterRenderer.nodeRendererStore.get as jest.Mock<any>
const createDefaultMock = graphterRenderer.createDefault as jest.Mock<any>

describe('<ListNodeRenderer />', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    when(nodeRendererStoreGetMock)
      .calledWith('string')
      .mockReturnValue({
        Renderer: () => <div>A child item</div>
      })
  })
  it('should render correctly', () => {
    useArrayNodeDataMock.mockReturnValue({ childIds: [ 'one', 'two' ] })
    const {container} = render(<ListNodeRenderer
      config={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'list',
        children: [ {
          id: 'list-item',
          name: 'List item',
          type: 'string'
        } ]
      }}
      configAncestry={[]}
      originalNodeData={[
        'item 1 value',
        'item 2 value'
      ]}
      originalNodeDataAncestry={[]}
      committed={true}
      path={[ '/' ]}
    />);
    expect(container).toMatchSnapshot();
  })
  it('should render default data when new', () => {
    useArrayNodeDataMock.mockReturnValue({ childIds: [] })
    createDefaultMock.mockReturnValue([])
    const config = {
      id: 'name',
      name: 'Name',
      description: 'The name',
      type: 'list',
      children: [ {
        id: 'list-item',
        name: 'List item',
        type: 'string'
      } ]
    }
    render(<ListNodeRenderer
      config={clone()(config)}
      configAncestry={[]}
      originalNodeData={undefined}
      originalNodeDataAncestry={[]}
      committed={true}
      path={[ '/' ]}
    />);
    expect(graphterRenderer.createDefault).toHaveBeenCalledWith(config, [])
    expect(useArrayNodeDataMock).toHaveBeenCalledWith([ '/' ], config, [], true)
  })
  it('should use the array data provider for data', () => {
    useArrayNodeDataMock.mockReturnValue({ childIds: [ 'one', 'two' ] })
    const config = {
      id: 'name',
      name: 'Name',
      description: 'The name',
      type: 'list',
      children: [ {
        id: 'list-item',
        name: 'List item',
        type: 'string'
      } ]
    }
    render(<ListNodeRenderer
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
    expect(useArrayNodeDataMock).toHaveBeenCalled()
  })
  it('should throw if non-array data is passed in', () => {
    expect.assertions(1)
    try {
      render(<ListNodeRenderer
        config={{
          id: 'name',
          name: 'Name',
          description: 'The name',
          type: 'list',
          children: [ {
            id: 'list-item',
            name: 'List item',
            type: 'string'
          } ]
        }}
        configAncestry={[]}
        originalNodeData={{
          some: 'non-array-data'
        }}
        originalNodeDataAncestry={[]}
        committed={true}
        path={[ '/' ]}
      />);
    } catch (err) {
      expect(err).toMatchSnapshot()
    }
  })
  it('should error when no child config is supplied', () => {
    expect.assertions(1)
    try {
      // @ts-ignore
      render(<ListNodeRenderer config={undefined}
                               configAncestry={[]}
                               originalNodeData={[
                                 'item 1 value',
                                 'item 2 value'
                               ]}
                               originalNodeDataAncestry={[]}
                               committed={true}
                               path={[ '/' ]}
      />);
    } catch (err) {
      expect(err).toMatchSnapshot()
    }
  })
  it('should error when more than one child config is supplied', () => {
    expect.assertions(1)
    try {
      render(<ListNodeRenderer
        config={{
          id: 'name',
          name: 'Name',
          description: 'The name',
          type: 'list',
          children: [
            {
              id: 'list-item-1',
              name: 'List item 1',
              type: 'string'
            },
            {
              id: 'list-item-2',
              name: 'List item 2',
              type: 'string'
            },
          ]
        }}
        configAncestry={[]}
        originalNodeData={[
          'item 1 value',
          'item 2 value'
        ]}
        originalNodeDataAncestry={[]}
        committed={true}
        path={[ '/' ]}
      />)
    } catch (err) {
      expect(err).toMatchSnapshot()
    }
  })
  it('should use the correct child renderer', () => {
    useArrayNodeDataMock.mockReturnValue({ childIds: [ 'one', 'two' ] })
    render(<ListNodeRenderer
      config={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'list',
        children: [ {
          id: 'list-item',
          name: 'List item',
          type: 'string'
        } ]
      }}
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

  it('should pass the correct props to the child renderer', () => {
    const rendererMock = jest.fn().mockReturnValue(<div>The child item</div>)
    when(nodeRendererStoreGetMock)
      .calledWith('string')
      .mockReturnValueOnce({
        Renderer: rendererMock
      })
    useArrayNodeDataMock.mockReturnValue({ childIds: [ 'one', 'two' ] })
    const { queryAllByText } = render(<ListNodeRenderer
      config={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'list',
        children: [ {
          id: 'list-item',
          name: 'List item',
          type: 'string'
        } ]
      }}
      configAncestry={[]}
      originalNodeData={[
        'item 1 value',
        'item 2 value'
      ]}
      originalNodeDataAncestry={[]}
      committed={true}
      path={[ '/' ]}
    />);
    expect(queryAllByText('The child item').length).toBe(2)
    expect(rendererMock).toHaveBeenCalled()
    const props = rendererMock.mock.calls[0][0]
    expect(props).toMatchSnapshot()
  })

  it('should render an empty item to add', () => {
    useArrayNodeDataMock.mockReturnValue({ childIds: [ 'one', 'two' ] })
    const { queryByTestId, getByText } = render(<ListNodeRenderer
      config={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'list',
        children: [ {
          id: 'list-item',
          name: 'List item',
          type: 'string'
        } ]
      }}
      configAncestry={[]}
      originalNodeData={[
        'item 1 value',
        'item 2 value'
      ]}
      originalNodeDataAncestry={[]}
      committed={true}
      path={[ '/' ]}
    />);
    act(() => {
      fireEvent.click(getByText('[+]'))
    })
    expect(queryByTestId('add-item')).not.toBeNull()
  })
  it('should commit a new item when the "add" button is selected', () => {
    const commitItemMock = jest.fn()
    useArrayNodeDataMock.mockImplementation(() => ({
      childIds: [ '1', '2' ],
      removeItem: () => {},
      commitItem: commitItemMock
    }))
    when(nodeRendererStoreGetMock)
      .calledWith('string')
      .mockReturnValue({
        Renderer: () => <input />
      })
    const { getByText } = render(<ListNodeRenderer
      config={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'list',
        children: [ {
          id: 'list-item',
          name: 'List item',
          type: 'string'
        } ]
      }}
      configAncestry={[]}
      originalNodeData={[
        'item 1 value',
        'item 2 value'
      ]}
      originalNodeDataAncestry={[]}
      committed={true}
      path={[ '/' ]}
    />);
    act(() => {
      fireEvent.click(getByText('[+]'))
    })
    act(() => {
      fireEvent.click(getByText('Add [+]'))
    })
    expect(commitItemMock).toHaveBeenCalledWith(2)
  })
  it.each([0, 1])
  ('should remove an item at the correct location (%s) when the remove ui is clicked', (index) => {
    const removeItemMock = jest.fn()
    useArrayNodeDataMock.mockImplementation(() => ({
      childIds: [ '1', '2' ],
      removeItem: removeItemMock,
      commitItem: () => {}
    }))
    const { queryAllByTestId } = render(<ListNodeRenderer
      config={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'list',
        children: [ {
          id: 'list-item',
          name: 'List item',
          type: 'string'
        } ]
      }}
      configAncestry={[]}
      originalNodeData={[
        'item 1 value',
        'item 2 value'
      ]}
      originalNodeDataAncestry={[]}
      committed={true}
      path={[ '/' ]}
    />);
    const removeButtons = queryAllByTestId('remove-item-btn')
    expect(removeButtons.length).toBe(2)
    act(() => {
      fireEvent.click(removeButtons[index])
    })
    expect(removeItemMock).toHaveBeenCalledWith(index)
  })
})

export {}