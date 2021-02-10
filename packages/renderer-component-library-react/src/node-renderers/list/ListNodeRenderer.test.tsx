/***
 * The number of test cases here could reflect that <ListNodeRenderer /> is doing too much.
 * TODO: revisit these tests and make them more concise and potentially split the component out further
 */

import React from "react";
import { act, render, fireEvent, within } from '@testing-library/react';
import {
  useArrayNodeData,
  useTreeData,
  nodeRendererStore,
  createDefault
} from "@graphter/renderer-react";
import ListNodeRenderer from "./ListNodeRenderer";
import clone from 'rfdc'
import { when } from "jest-when";

const useArrayNodeDataMock = useArrayNodeData as jest.Mock<any>
const useTreeDataMock = useTreeData as jest.Mock<any>
const nodeRendererStoreGetMock = nodeRendererStore.get as jest.Mock<any>
const createDefaultMock = createDefault as jest.Mock<any>

describe('<ListNodeRenderer />', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    when(nodeRendererStoreGetMock)
      .calledWith('object')
      .mockReturnValue({
        Renderer: () => <div>A child item</div>
      })
    when(nodeRendererStoreGetMock)
      .calledWith('string')
      .mockReturnValue({
        Renderer: () => <div>A child item</div>
      })
  })
  it('should render child objects correctly', () => {
    const childConfig = {
      id: 'page',
      name: 'Page item',
      type: 'object',
      children: [
        { id: 'title', type: 'string' },
        { id: 'description', type: 'string' }
      ]
    }
    useArrayNodeDataMock.mockReturnValue({ childIds: [ 'one', 'two' ] })
    const item0 = Object.freeze({ title: 'Page 0 Title', description: 'Page 0 description' })
    const item1 = Object.freeze({ title: 'Page 1 Title', description: 'Page 1 description' })
    when(useTreeDataMock)
      .calledWith(childConfig, [ 'pages', 0 ])
      .mockReturnValue(item0)
      .calledWith(childConfig, [ 'pages', 1 ])
      .mockReturnValue(item1)
    const {container} = render(<ListNodeRenderer
      config={{
        id: 'pages',
        name: 'Pages',
        type: 'list',
        children: [ childConfig ]
      }}
      configAncestry={[]}
      originalNodeData={[ item0, item1 ]}
      originalNodeDataAncestry={[]}
      committed={true}
      path={[ 'pages' ]}
    />);
    expect(container).toMatchSnapshot();
  })
  it('should render child strings correctly', () => {
    const rendererMock = jest.fn().mockReturnValue(<div>The child item</div>)
    when(nodeRendererStoreGetMock)
      .calledWith('string')
      .mockReturnValueOnce({
        Renderer: rendererMock
      })
    useArrayNodeDataMock.mockReturnValue({ childIds: [ 'one', 'two' ] })
    const childConfig = {
      id: 'list-item',
      name: 'List item',
      type: 'string'
    }
    when(useTreeDataMock)
      .calledWith(childConfig, [ '/', 0 ])
      .mockReturnValue('item 1 value')
      .calledWith(childConfig, [ '/', 1 ])
      .mockReturnValue('item 2 value')
    const { queryByText } = render(<ListNodeRenderer
      config={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'list',
        children: [ childConfig ]
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
    expect(queryByText('item 1 value')).not.toBeNull()
    expect(queryByText('item 2 value')).not.toBeNull()
  })
  it('should render items in "edit" mode correctly', () => {
    const rendererMock = jest.fn().mockReturnValue(<div>The child item</div>)
    nodeRendererStoreGetMock.mockReset()
    when(nodeRendererStoreGetMock)
      .calledWith('string')
      .mockReturnValue({
        Renderer: rendererMock
      })
    useArrayNodeDataMock.mockReturnValue({ childIds: [ 'one', 'two' ] })
    const childConfig = {
      id: 'list-item',
      name: 'List item',
      type: 'string'
    }
    when(useTreeDataMock)
      .calledWith(childConfig, [ '/', 0 ])
      .mockReturnValue('item 1 value')
      .calledWith(childConfig, [ '/', 1 ])
      .mockReturnValue('item 2 value')
    const { container, getAllByText, getAllByTestId } = render(<ListNodeRenderer
      config={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'list',
        children: [ childConfig ]
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
    getAllByTestId('default-item-view').forEach(listViewItem =>
      act(() => {
        fireEvent.click(listViewItem)
      }))
    expect(container).toMatchSnapshot()
    expect(getAllByText('The child item').length).toBe(2)
    expect(rendererMock).toHaveBeenCalled()
    const props = rendererMock.mock.calls[0][0]
    expect(props).toMatchSnapshot()
  })
  it('should return an item to "view" mode when the Done button is clicked', () => {
    const rendererMock = jest.fn().mockReturnValue(<div>The child item</div>)
    nodeRendererStoreGetMock.mockReset()
    when(nodeRendererStoreGetMock)
      .calledWith('string')
      .mockReturnValue({
        Renderer: rendererMock
      })
    useArrayNodeDataMock.mockReturnValue({ childIds: [ 'one', 'two' ] })
    const childConfig = {
      id: 'list-item',
      name: 'List item',
      type: 'string'
    }
    when(useTreeDataMock)
      .calledWith(childConfig, [ '/', 0 ])
      .mockReturnValue('item 1 value')
      .calledWith(childConfig, [ '/', 1 ])
      .mockReturnValue('item 2 value')
    const { getByText, getAllByTestId } = render(<ListNodeRenderer
      config={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'list',
        children: [ childConfig ]
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
    const firstItem = getAllByTestId('default-item-view')[0]
    act(() => {
      fireEvent.click(firstItem)
    })
    expect(getAllByTestId('default-item-view').length).toBe(1)
    act(() => {
      fireEvent.click(getByText('Done'))
    })
    expect(getAllByTestId('default-item-view').length).toBe(2)
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
    expect(createDefault).toHaveBeenCalledWith(config, [])
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
    const { queryAllByTestId, getByTestId } = render(<ListNodeRenderer
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
    const viewItems = queryAllByTestId('default-item-view')
    expect(viewItems.length).toBe(2)
    act(() => {
      fireEvent.click(viewItems[index])
    })
    const removeButton = getByTestId('remove-item-btn')
    act(() => {
      fireEvent.click(removeButton)
    })
    expect(removeItemMock).toHaveBeenCalledWith(index)
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
})

export {}