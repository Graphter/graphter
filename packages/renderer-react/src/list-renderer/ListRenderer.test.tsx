import React from "react";
import ListRenderer from "./ListRenderer";
import { act, render } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import ServiceProvider from "../service-provider";
import { RenderItemProps } from "./RenderItemProps";
import { RenderPaginationProps } from "./RenderPaginationProps";
import { ListResult, NodeConfig } from "@graphter/core";

function MockPagination({ count }: RenderPaginationProps) {
  return (
    <div data-testid='pagination'>
      {count}
    </div>
  );
}

function MockItemRenderer ({ item }: RenderItemProps) {
  return (
    <div key={item.id} data-testid='item-renderer'>
      #{item.id} {item.title} - {item.somethingElse}
    </div>
  );
}



describe('<ListRenderer />', () => {
  let baseModelConfig: NodeConfig,
    mockService: any,
    mockListResult: ListResult;

  beforeEach(() => {
    baseModelConfig = {
      id: 'page',
      name: 'Page',
      type: 'object',
      children: [
        { id: 'id', type: 'number' },
        { id: 'somethingElse', type: 'string'},
        { id: 'title', type: 'string' },
      ]
    };

    mockService = {
      list: jest.fn().mockResolvedValue({
        items: [],
        count: 10,
        skip: 0,
        take: 10
      }),
      get: jest.fn().mockResolvedValue({
        item: {},
        version: 1,
        created: new Date(),
        updated: new Date(),
        deleted: false
      }),
      save: jest.fn().mockResolvedValue({
        item: {},
        version: 2,
        updated: new Date()
      }),
    };

    mockListResult = {
      items: [
        {
          id: 1,
          title: 'some page name',
          somethingElse: 'blah blah blah'
        }
      ],
      count: 0,
      skip: 0,
      take: 10
    };
  });
  it('should load the first set of items', async () => {
    mockService.list.mockResolvedValue({ items: [], count: 0, skip: 0, take: 10 });
    await act( async() => {
      render(
        <ServiceProvider service={mockService}>
          <ListRenderer
            config={baseModelConfig}
            renderItem={() => <div>Item</div>}
            renderPagination={() => <div>Page</div>}
          />
        </ServiceProvider>);
    });
    expect(mockService.list).toHaveBeenCalledWith('page', 0, 10);
  });
  it('should load paginated items', async () => {
    mockService.list.mockResolvedValue({ items: [], count: 0, skip: 0, take: 10 });
    await act( async() => {
      render(
        <ServiceProvider service={mockService}>
          <ListRenderer
            config={baseModelConfig}
            renderItem={() => <div>Item</div>}
            renderPagination={() => <div>Page</div>}
            page={2}
            size={20}
          />
        </ServiceProvider>);
    });
    expect(mockService.list).toHaveBeenCalledWith('page', 20, 20);
  });
  it('should render items using the supplied item renderer', async () => {
    mockService.list.mockResolvedValue({
      items: [
        {
          id: 1,
          title: 'some page name',
          somethingElse: 'blah blah blah'
        }
      ],
      count: 0,
      skip: 0,
      take: 10
    });

    await act( async() => {
      render(
        <ServiceProvider service={mockService}>
          <ListRenderer
            config={baseModelConfig}
            renderItem={MockItemRenderer}
            renderPagination={() => <div>Page</div>}
          />
        </ServiceProvider>);
    });
    const item = screen.getByTestId('item-renderer');
    expect(item).toMatchSnapshot()
  });
  it('should render items using the supplied pagination control', async () => {
    mockService.list.mockResolvedValue(mockListResult);
    await act( async() => {
      render(
        <ServiceProvider service={mockService}>
          <ListRenderer
            config={baseModelConfig}
            renderItem={() => <div>Item</div>}
            renderPagination={MockPagination}
          />
        </ServiceProvider>);
    });
    const item = screen.getByTestId('pagination');
    expect(item).toMatchSnapshot()
  });
  it(`should display an appropriate error when a list item renderer throws and error`, async () => {
    function ErroringListItemRenderer(){
      throw new Error('Some item renderer error!');
      return null;
    }
    mockService.list.mockResolvedValue(mockListResult);
    await act( async() => {
      render(
        <ServiceProvider service={mockService}>
          <ListRenderer
            config={baseModelConfig}
            renderItem={ErroringListItemRenderer}
            renderPagination={MockPagination}
          />
        </ServiceProvider>);
    });
    const item = screen.getByTestId('error');
    expect(item).toMatchSnapshot();
  });
  it(`should display an appropriate error when the pagination component throws an error`, async () => {
    function ErroringPagination(){
      throw new Error('Some pagination error!');
      return null;
    }
    mockService.list.mockResolvedValue(mockListResult);
    await act( async() => {
      render(
        <ServiceProvider service={mockService}>
          <ListRenderer
            config={baseModelConfig}
            renderItem={MockItemRenderer}
            renderPagination={ErroringPagination}
          />
        </ServiceProvider>);
    });
    const item = screen.getByTestId('error');
    expect(item).toMatchSnapshot();
  });
  it(`should display an appropriate error when service can't load data`, async () => {
    mockService.list.mockRejectedValue(new Error('Some data loading issue'));
    await act( async() => {
      render(
        <ServiceProvider service={mockService}>
          <ListRenderer
            config={baseModelConfig}
            renderItem={MockItemRenderer}
            renderPagination={MockPagination}
          />
        </ServiceProvider>);
    });
    const item = screen.getByTestId('error');
    expect(item).toMatchSnapshot();
  });
  it(`should display an appropriate error when no list renderer is provided`, async () => {
    mockService.list.mockResolvedValue(mockListResult);
    await act( async() => {
      render(
        <ServiceProvider service={mockService}>
          <ListRenderer
            config={baseModelConfig}
            // @ts-ignore
            renderItem={null}
            renderPagination={MockPagination}
          />
        </ServiceProvider>);
    });
    const item = screen.getByTestId('error');
    expect(item).toMatchSnapshot();
  });
});

export {};