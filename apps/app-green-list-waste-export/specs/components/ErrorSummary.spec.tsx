import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import '@testing-library/jest-dom';
import { ErrorSummary } from 'components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  }),
);

describe('ErrorSummary', () => {
  it('renders with default props', () => {
    render(<ErrorSummary />);

    expect(
      screen.getByRole('heading', { name: 'There is a problem' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Description')).toBeNull();
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('renders with custom props', () => {
    const errors = [
      { targetName: 'error1', text: 'Error 1' },
      { targetName: 'error2', text: 'Error 2' },
    ];

    render(
      <ErrorSummary
        heading="Custom Heading"
        description="Custom Description"
        errors={errors}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Custom Heading' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Custom Description')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('calls onHandleErrorClick when a link is clicked', async () => {
    const onHandleErrorClickMock = jest.fn();
    const errors = [{ targetName: 'error1', text: 'Error 1' }];
    await act(async () => {
      render(
        <ErrorSummary
          onHandleErrorClick={onHandleErrorClickMock}
          errors={errors}
        />,
      );
    });
    const link = screen.getByText('Error 1');
    expect(link).toBeInTheDocument();
    fireEvent.click(link);
    expect(onHandleErrorClickMock).toHaveBeenCalled();
  });
});
