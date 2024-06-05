import { render, screen, within, act } from 'jest-utils';
import { ConditionalRadioWrap } from 'components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

describe('ConditionalRadioWrap', () => {
  it('renders', async () => {
    await act(async () => {
      render(
        <ConditionalRadioWrap testId="testConditionalRadioWrap">
          <>Test</>
        </ConditionalRadioWrap>,
      );
    });

    expect(screen.getByTestId('testConditionalRadioWrap')).toBeTruthy();
  });
  it('renders the children', async () => {
    await act(async () => {
      render(
        <ConditionalRadioWrap testId="testConditionalRadioWrap">
          <div data-testid="testRadioChild" />
        </ConditionalRadioWrap>,
      );
    });

    expect(
      within(screen.getByTestId('testConditionalRadioWrap')).getByTestId(
        'testRadioChild',
      ),
    ).toBeTruthy();
  });
});
