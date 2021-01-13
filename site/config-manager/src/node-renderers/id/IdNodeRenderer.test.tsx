import React from "react";
import { act, render, fireEvent } from '@testing-library/react';
import * as graphterRenderer from "@graphter/renderer-react";
import IdNodeRenderer from "./IdNodeRenderer";
import { when } from "jest-when";
import { nanoid } from 'nanoid'

const useNodeDataMock = graphterRenderer.useNodeData as  jest.Mock<any>
const useNodeValidationMock = graphterRenderer.useNodeValidation as  jest.Mock<any>
const createDefaultMock = graphterRenderer.createDefault as jest.Mock<any>

describe(`<IdNodeRenderer />`, () => {
  afterEach(() => {
    useNodeDataMock.mockClear()
  })
  it(`should render correctly`, () => {
    useNodeDataMock.mockReturnValue([ 'some-data', () => {} ])
    const { container } = render(<IdNodeRenderer
      config={{
        id: 'id',
        name: 'Name',
        description: 'The name',
        type: 'id',
        default: 'Unnamed'
      }}
      originalNodeData={'Foo Bar'}
      committed={true}
      path={['/']}
    />);
    expect(container).toMatchSnapshot();
  });
  it('should render default data when new', () => {
    useNodeDataMock.mockReturnValue([ 'The default value', () => {} ])
    createDefaultMock.mockReturnValue('The default value')
    const config = {
      id: 'id',
      name: 'Name',
      description: 'The name',
      type: 'id',
      default: 'The default value'
    }
    render(<IdNodeRenderer
      config={config}
      originalNodeData={undefined}
      committed={true}
      path={['/']}
    />);
    expect(useNodeDataMock).toHaveBeenCalled()
    expect(createDefaultMock).toHaveBeenCalledWith(config, nanoid)
    expect(useNodeDataMock.mock.calls[0][2]).toBe('The default value')
  })
  it('should use the data provider for data', () => {
    useNodeDataMock.mockReturnValue([ 'The data provider value', () => {} ])
    const { queryByDisplayValue } = render(<IdNodeRenderer
      config={{
        id: 'id',
        name: 'Name',
        description: 'The name',
        type: 'id',
        default: 'The default value'
      }}
      originalNodeData={'The original value'}
      committed={true}
      path={['/']}
    />);
    expect(queryByDisplayValue('The data provider value')).toBeInTheDocument()
  })
  it('should show validation errors when touched', () => {
    const config = {
      id: 'id',
      name: 'Name',
      description: 'The name',
      type: 'id',
      default: 'The default value'
    }
    useNodeDataMock.mockReturnValue([ 'The data provider value', () => {} ])
    useNodeValidationMock.mockReturnValueOnce({
      path: [ 'name' ],
      config,
      value: 'The original value',
      results: [
        {
          valid: true,
          errorMessage: 'Some validation error message'
        }
      ]
    })
    useNodeValidationMock.mockReturnValueOnce({
      path: [ 'name' ],
      config,
      value: 'The data provider value',
      results: [
        {
          valid: false,
          errorMessage: 'Some validation error message'
        }
      ]
    })
    const { getByDisplayValue, queryByText } = render(<IdNodeRenderer
      config={config}
      originalNodeData={'The original value'}
      committed={true}
      path={['/']}
    />);
    act(() => {
      fireEvent.change(getByDisplayValue('The data provider value'), { target: { value: '' }})
    })
    expect(queryByText('Some validation error message')).toBeInTheDocument()
  })
  it('should not show "Ok" feedback when not touched', () => {
    useNodeDataMock.mockReturnValue([ 'some-data', () => {} ])
    const { queryByText } = render(<IdNodeRenderer
      config={{
        id: 'id',
        name: 'Name',
        description: 'The name',
        type: 'id',
        default: 'Unnamed'
      }}
      originalNodeData={'Foo Bar'}
      committed={true}
      path={['/']}
    />);
    expect(queryByText('Ok')).toBeNull()
  })
  it('should show "Ok" feedback if touched and value is a valid ID', () => {
    const config = { id: 'id', type: 'id' }
    useNodeDataMock.mockReturnValue([ 'the-original-id', () => {} ])
    useNodeValidationMock.mockReturnValue({
      path: [ 'name' ],
      config,
      value: 'the-original-id',
      results: []
    })
    const { getByDisplayValue, queryByText } = render(<IdNodeRenderer
      config={config}
      originalNodeData={'the-original-id'}
      committed={true}
      path={['/']}
    />);
    act(() => {
      fireEvent.change(getByDisplayValue('the-original-id'), { target: { value: 'a-new-valid-id' }})
    })
    expect(queryByText('Ok')).not.toBeNull()
  })
  it('should show "Fix" button when value is an invalid ID', () => {
    const config = { id: 'id', type: 'id' }
    useNodeDataMock.mockReturnValueOnce([ 'the-original-id', () => {} ])
    useNodeDataMock.mockReturnValueOnce([ 'An invalid ID!!', () => {} ])
    useNodeValidationMock.mockReturnValue({
      path: [ 'name' ],
      config,
      value: 'the-original-id',
      results: []
    })
    const { getByDisplayValue, queryByText } = render(<IdNodeRenderer
      config={config}
      originalNodeData={'the-original-id'}
      committed={true}
      path={['/']}
    />);
    act(() => {
      fireEvent.change(getByDisplayValue('the-original-id'), { target: { value: 'An invalid ID!!' }})
    })
    expect(queryByText('Fix')).not.toBeNull()
  })
  it('should correct the value when the "Fix" button is clicked', () => {
    const config = { id: 'id', type: 'id' }
    useNodeDataMock.mockReturnValueOnce([ 'the-original-id', () => {} ])
    useNodeDataMock.mockReturnValueOnce([ 'An invalid ID!!', () => {} ])
    useNodeDataMock.mockReturnValueOnce([ 'an-invalid-id--', () => {} ])
    useNodeValidationMock.mockReturnValue({
      path: [ 'name' ],
      config,
      value: 'the-original-id',
      results: []
    })
    const { getByDisplayValue, queryByDisplayValue, getByText, rerender } = render(<IdNodeRenderer
      config={config}
      originalNodeData={'the-original-id'}
      committed={true}
      path={['/']}
    />);
    act(() => {
      fireEvent.change(getByDisplayValue('the-original-id'), { target: { value: 'An invalid ID!!' }})
    })
    act(() => {
      fireEvent.click(getByText('Fix'))
    })
    rerender(<IdNodeRenderer
      config={config}
      originalNodeData={'the-original-id'}
      committed={true}
      path={['/']}
    />)
    expect(queryByDisplayValue('an-invalid-id--')).not.toBeNull()
  })
  it('should not show validation results when not touched', () => {
    useNodeDataMock.mockReturnValue([ 'The data provider value', () => {} ])
    useNodeValidationMock.mockReturnValue([
      {
        errorMessage: 'Some validation error message'
      }
    ])
    const { queryByText } = render(<IdNodeRenderer
      config={{
        id: 'id',
        name: 'Name',
        description: 'The name',
        type: 'id',
        default: 'The default value'
      }}
      originalNodeData={'The original value'}
      committed={true}
      path={['/']}
    />);
    expect(queryByText('Some validation error message')).not.toBeInTheDocument()
  })
  it('should not show validation errors that do not match the current input (e.g. because async validation)', () => {
    const config = {
      id: 'id',
      name: 'Name',
      description: 'The name',
      type: 'id',
      default: 'The default value'
    }
    useNodeDataMock.mockReturnValue([ 'The data provider value', () => {} ])
    const originalResult = {
      path: [ 'name' ],
      config,
      value: 'The original value',
      results: [
        {
          valid: true,
          errorMessage: 'Some validation error message'
        }
      ]
    }
    useNodeValidationMock.mockReturnValueOnce(originalResult)
    useNodeValidationMock.mockReturnValueOnce(originalResult)
    let { getByDisplayValue, queryByText, rerender } = render(<IdNodeRenderer
      config={config}
      originalNodeData={'The original value'}
      committed={true}
      path={['/']}
    />);
    act(() => {
      fireEvent.change(getByDisplayValue('The data provider value'), { target: { value: '' }})
    })
    expect(queryByText('Some validation error message')).not.toBeInTheDocument()
    useNodeValidationMock.mockReturnValueOnce({
      path: [ 'name' ],
      config,
      value: 'The data provider value',
      results: [
        {
          valid: false,
          errorMessage: 'Some validation error message'
        }
      ]
    })
    rerender(<IdNodeRenderer
      config={config}
      originalNodeData={'The original value'}
      committed={true}
      path={['/']}
    />)
    expect(queryByText('Some validation error message')).toBeInTheDocument()
  })
})

export {};