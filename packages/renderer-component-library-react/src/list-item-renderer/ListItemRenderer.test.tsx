import React from "react";
import ListItemRenderer from "./ListItemRenderer";
import { act, render, within } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import { shallow } from 'enzyme';

describe('<ListItem />', () => {

  describe(`when no paths are passed in`, () => {

    it.each([ 'name', 'Name', 'title', 'Title', 'id', 'Id', 'ID' ])(
      `should look for a property called %p to guess as title`, async (prop) => {
        const { container, getByText } = render(<ListItemRenderer item={{
          somethingElse: 'blah blah',
          [prop]: 'Some name',
          description: 'Some descriptive text'
        }} />);
        expect(getByText('Some name')).not.toBeNull();
        expect(container).toMatchSnapshot();
      });

    it.each([ 'description', 'Description' ])(
      `should look for a property called %p to guess as subtext`, async (prop) => {
        const { container, getByText } = render(<ListItemRenderer item={{
          somethingElse: 'blah blah',
          name: 'Some Name',
          [prop]: 'Some descriptive text'
        }}/>);
        expect(getByText('Some descriptive text')).not.toBeNull();
        expect(container).toMatchSnapshot();
      });

  });

  it('should use titlePath and subtextPath when defined', async () => {
    const { getByText } = render(<ListItemRenderer
      titlePath={[ 'aSpecialName' ]}
      subtextPath={[ 'aSpecialDescription' ]}
      item={{
        aSpecialName: 'Some Special Name',
        aSpecialDescription: 'blah blah special blah',
      }}
    />);
    expect(getByText('Some Special Name')).not.toBeNull();
    expect(getByText('blah blah special blah')).not.toBeNull();
  });
});

export {};