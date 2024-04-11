import { render, screen, within } from 'jest-utils';
import { ConditionalRadioWrap } from 'components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  })
);

describe('ConditionalRadioWrap', () => {
  it('renders', () => {
    render(
      <ConditionalRadioWrap testId="testConditionalRadioWrap">
        <></>
      </ConditionalRadioWrap>
    );
    expect(screen.getByTestId('testConditionalRadioWrap')).toBeTruthy();
  });
  it('renders the children', () => {
    render(
      <ConditionalRadioWrap testId="testConditionalRadioWrap">
        <div data-testid="testRadioChild" />
      </ConditionalRadioWrap>
    );

    expect(
      within(screen.getByTestId('testConditionalRadioWrap')).getByTestId(
        'testRadioChild'
      )
    ).toBeTruthy();
  });
});
