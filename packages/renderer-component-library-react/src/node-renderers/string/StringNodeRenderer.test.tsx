import React from "react";
import { act, render, fireEvent } from '@testing-library/react';
import * as graphterRenderer from "@graphter/renderer-react";
import StringNodeRenderer from "./StringNodeRenderer";

const useNodeDataMock = graphterRenderer.useNodeData as  jest.Mock<any>
const useNodeValidationMock = graphterRenderer.useNodeValidation as  jest.Mock<any>
const createDefaultMock = graphterRenderer.createDefault as jest.Mock<any>

describe(`<StringNodeRenderer />`, () => {
  afterEach(() => {
    useNodeDataMock.mockClear()
  })
  it(`should render correctly`, () => {
    useNodeDataMock.mockReturnValue([ 'some-data', () => {} ])
    const { container } = render(<StringNodeRenderer
      config={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'string',
        default: 'Unnamed'
      }}
      configAncestry={[]}
      originalNodeData={'Foo Bar'}
      originalNodeDataAncestry={[]}
      committed={true}
      path={['/']}
    />);
    expect(container).toMatchSnapshot();
  });
  it('should render default data when new', () => {
    useNodeDataMock.mockReturnValue([ 'The default value', () => {} ])
    createDefaultMock.mockReturnValue('The default value')
    const config = {
      id: 'name',
      name: 'Name',
      description: 'The name',
      type: 'string',
      default: 'The default value'
    }
    render(<StringNodeRenderer
      config={config}
      configAncestry={[]}
      originalNodeData={undefined}
      originalNodeDataAncestry={[]}
      committed={true}
      path={['/']}
    />);
    expect(useNodeDataMock).toHaveBeenCalled()
    expect(createDefaultMock).toHaveBeenCalledWith(config, '')
    expect(useNodeDataMock.mock.calls[0][2]).toBe('The default value')
  })
  it('should use the data provider for data', () => {
    useNodeDataMock.mockReturnValue([ 'The data provider value', () => {} ])
    const { queryByDisplayValue } = render(<StringNodeRenderer
      config={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'string',
        default: 'The default value'
      }}
      configAncestry={[]}
      originalNodeData={'The original value'}
      originalNodeDataAncestry={[]}
      committed={true}
      path={['/']}
    />);
    expect(queryByDisplayValue('The data provider value')).toBeInTheDocument()
  })
  it('should show validation errors when touched', () => {
    const config = {
      id: 'name',
      name: 'Name',
      description: 'The name',
      type: 'string',
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
    const { getByDisplayValue, queryByText } = render(<StringNodeRenderer
      config={config}
      configAncestry={[]}
      originalNodeData={'The original value'}
      originalNodeDataAncestry={[]}
      committed={true}
      path={['/']}
    />);
    act(() => {
      fireEvent.change(getByDisplayValue('The data provider value'), { target: { value: '' }})
    })
    expect(queryByText('Some validation error message')).toBeInTheDocument()
  })
  it('should not show validation results when not touched', () => {
    useNodeDataMock.mockReturnValue([ 'The data provider value', () => {} ])
    useNodeValidationMock.mockReturnValue([
      {
        errorMessage: 'Some validation error message'
      }
    ])
    const { queryByText } = render(<StringNodeRenderer
      config={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'string',
        default: 'The default value'
      }}
      configAncestry={[]}
      originalNodeData={'The original value'}
      originalNodeDataAncestry={[]}
      committed={true}
      path={['/']}
    />);
    expect(queryByText('Some validation error message')).not.toBeInTheDocument()
  })
  it('should not show validation errors that do not match the current input (e.g. because async validation)', () => {
    const config = {
      id: 'name',
      name: 'Name',
      description: 'The name',
      type: 'string',
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
    let { getByDisplayValue, queryByText, rerender } = render(<StringNodeRenderer
      config={config}
      configAncestry={[]}
      originalNodeData={'The original value'}
      originalNodeDataAncestry={[]}
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
    rerender(<StringNodeRenderer
      config={config}
      configAncestry={[]}
      originalNodeData={'The original value'}
      originalNodeDataAncestry={[]}
      committed={true}
      path={['/']}
    />)
    expect(queryByText('Some validation error message')).toBeInTheDocument()
  })
})

export {};