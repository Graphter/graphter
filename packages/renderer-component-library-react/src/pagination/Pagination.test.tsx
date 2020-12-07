import React from "react";
import { render } from '@testing-library/react';
import Pagination from "./Pagination";


describe(`<Pagination />`, () => {
  it(`should render the correct number of clickable pages`, () => {
    const { getAllByText } = render(<Pagination
      page={0}
      size={10}
      count={21}
      renderPageItem={({ page}) => <div key={page}>item</div>}/>);
    expect(getAllByText('item').length).toBe(3);
  });
  it(`should display the correct page as current`, () => {
    const itemMock = jest.fn()
    const { container } = render(<Pagination
      page={2}
      size={10}
      count={21}
      renderPageItem={itemMock}/>);
    expect(itemMock).toHaveBeenCalledWith({ isCurrent: true, page: 2, size: 10 })
  });
});
export {};