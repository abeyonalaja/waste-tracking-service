import { render, screen, within, act } from 'jest-utils';
import { BreadcrumbWrap } from 'components/BreadcrumbWrap';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

describe('BreadcrumbWrap', () => {
  it('renders', async () => {
    await act(async () => {
      render(
        <BreadcrumbWrap testId="testBreadcrumbWrap">
          <></>
        </BreadcrumbWrap>,
      );
    });
    expect(screen.getByTestId('testBreadcrumbWrap')).toBeTruthy();
  });
  it('renders the children', async () => {
    await act(async () => {
      render(
        <BreadcrumbWrap testId="testBreadcrumbWrap">
          <div data-testid="testBreadcrumb" />
        </BreadcrumbWrap>,
      );
    });

    expect(
      within(screen.getByTestId('testBreadcrumbWrap')).getByTestId(
        'testBreadcrumb',
      ),
    ).toBeTruthy();
  });
});
