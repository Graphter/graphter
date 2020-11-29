import * as Enzyme from 'enzyme'
// @ts-ignore
import ReactSixteenAdapter from 'enzyme-adapter-react-16'

import '@testing-library/jest-dom/extend-expect';

Enzyme.configure({
  adapter: new ReactSixteenAdapter(),
});

export {};