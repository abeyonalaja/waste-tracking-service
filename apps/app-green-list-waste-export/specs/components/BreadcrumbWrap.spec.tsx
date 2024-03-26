import { render, screen, within } from '@testing-library/react';
import { BreadcrumbWrap } from 'components';

describe('BreadcrumbWrap', () => {
  it('renders', () => {
    render(
      <BreadcrumbWrap testId="testBreadcrumbWrap">
        <></>
      </BreadcrumbWrap>
    );
    expect(screen.getByTestId('testBreadcrumbWrap')).toBeTruthy();
  });
  it('renders the children', () => {
    render(
      <BreadcrumbWrap testId="testBreadcrumbWrap">
        <div data-testid="testBreadcrumb" />
      </BreadcrumbWrap>
    );

    expect(
      within(screen.getByTestId('testBreadcrumbWrap')).getByTestId(
        'testBreadcrumb'
      )
    ).toBeTruthy();
  });
});
