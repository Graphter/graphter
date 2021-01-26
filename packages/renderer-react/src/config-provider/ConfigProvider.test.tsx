import React from 'react';
import ConfigProvider, {useConfig} from "./ConfigProvider";
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import { NodeConfig } from "@graphter/core";

describe(`<ConfigProvider />`, () => {
  let mockConfig: NodeConfig;

  function ConsumerMock({ cb }: { cb?: (config: NodeConfig) => void }) {
    const config = useConfig('mock-config');
    cb && cb(config)
    return null;
  }

  beforeEach(() => {
    mockConfig = {
      id: 'mock-config',
      type: 'mock'
    };
  });

  it(`should render children`, () => {
    render(
      <ConfigProvider configs={[
        mockConfig
      ]}>
        <div data-testid='some-child-component'>Some child component</div>
      </ConfigProvider>
    );
    const childComponent = screen.queryByTestId('some-child-component');
    expect(childComponent).not.toBeNull();
  });

  describe(' when using useConfig', () => {

    it(`should error when no provider is declared`, () => {
      expect(() => (
        render(<ConsumerMock />)
      )).toThrowErrorMatchingSnapshot();
    });

    it(`should return the config passed to the provider`, () => {
      const cbFn = jest.fn()
      render(
        <ConfigProvider configs={[
          mockConfig
        ]}>
          <ConsumerMock cb={cbFn}/>
        </ConfigProvider>
      );
      expect(cbFn).toHaveBeenCalledWith(mockConfig)
    });

  });

});


export {};