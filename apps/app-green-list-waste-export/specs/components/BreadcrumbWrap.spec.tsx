import { render, screen, within } from 'jest-utils';
import { BreadcrumbWrap } from 'components/BreadcrumbWrap';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  }),
);

describe('BreadcrumbWrap', () => {
  it('renders', () => {
    render(
      <BreadcrumbWrap testId="testBreadcrumbWrap">
        <></>
      </BreadcrumbWrap>,
    );
    expect(screen.getByTestId('testBreadcrumbWrap')).toBeTruthy();
  });
  it('renders the children', () => {
    render(
      <BreadcrumbWrap testId="testBreadcrumbWrap">
        <div data-testid="testBreadcrumb" />
      </BreadcrumbWrap>,
    );

    expect(
      within(screen.getByTestId('testBreadcrumbWrap')).getByTestId(
        'testBreadcrumb',
      ),
    ).toBeTruthy();
  });
});
