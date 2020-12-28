import React, {ComponentType} from 'react';
import { act, render, within } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import ErrorBoundary from "./ErrorBoundary";
import DefaultError from "../default-error";

describe(`<ErrorBoundary />`, () => {

  it(`should render children when no error is raised`, () => {
    const { container } = render(
      <ErrorBoundary errorRenderer={DefaultError}>
        <div>some child</div>
      </ErrorBoundary>
    )
  });
  it(`should display Error errors with the defined renderer`, () => {
    function ErroringComponent(): null{
      throw new Error('This is an Error error');
    }
    act(() => {
      render(
        <ErrorBoundary errorRenderer={DefaultError}>
          <ErroringComponent />
        </ErrorBoundary>
      );
    });
    const error = screen.getByTestId('error');
    expect(error).toMatchSnapshot();
  });
  it(`should display string errors with the defined renderer`, () => {
    function ErroringComponent(): null{
      throw 'This is a string error';
    }
    act(() => {
      render(
        <ErrorBoundary errorRenderer={DefaultError}>
          <ErroringComponent />
        </ErrorBoundary>
      );
    });
    const error = screen.getByTestId('error');
    expect(error).toMatchSnapshot();
  });
});

export {};