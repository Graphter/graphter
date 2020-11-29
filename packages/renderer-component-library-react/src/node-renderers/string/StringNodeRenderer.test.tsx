import React from "react";
import { act, render, fireEvent } from '@testing-library/react';
import * as graphterRenderer from "@graphter/renderer-react";
import StringRenderer from "./StringNodeRenderer";

jest.spyOn(graphterRenderer, 'useNodeData').mockImplementation(() => [ null, () => {} ])
jest.spyOn(graphterRenderer, 'useNodeValidation').mockImplementation(() => [] )

const useNodeDataMock = graphterRenderer.useNodeData as  jest.Mock<any>
const useNodeValidationMock = graphterRenderer.useNodeValidation as  jest.Mock<any>

describe(`<StringRenderer />`, () => {
  afterEach(() => {
    useNodeDataMock.mockClear()
  })
  it(`should render correctly`, () => {
    useNodeDataMock.mockReturnValue([ 'some-data', () => {} ])
    const { container } = render(<StringRenderer
      config={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'string',
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
    const { getByDisplayValue } = render(<StringRenderer
      config={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'string',
        default: 'The default value'
      }}
      originalNodeData={undefined}
      committed={true}
      path={['/']}
    />);
    expect(useNodeDataMock).toHaveBeenCalled()
    expect(useNodeDataMock.mock.calls[0][2]).toBe('The default value')
  })
  it('should use the data provider for data', () => {
    useNodeDataMock.mockReturnValue([ 'The data provider value', () => {} ])
    const { queryByDisplayValue } = render(<StringRenderer
      config={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'string',
        default: 'The default value'
      }}
      originalNodeData={'The original value'}
      committed={true}
      path={['/']}
    />);
    expect(queryByDisplayValue('The data provider value')).toBeInTheDocument()
  })
  it('should show validation results when touched', () => {
    useNodeDataMock.mockReturnValue([ 'The data provider value', () => {} ])
    useNodeValidationMock.mockReturnValue([
      {
        errorMessage: 'Some validation error message'
      }
    ])
    const { getByDisplayValue, queryByText } = render(<StringRenderer
      config={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'string',
        default: 'The default value'
      }}
      originalNodeData={'The original value'}
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
    const { queryByText } = render(<StringRenderer
      config={{
        id: 'name',
        name: 'Name',
        description: 'The name',
        type: 'string',
        default: 'The default value'
      }}
      originalNodeData={'The original value'}
      committed={true}
      path={['/']}
    />);
    expect(queryByText('Some validation error message')).not.toBeInTheDocument()
  })
})

export {};