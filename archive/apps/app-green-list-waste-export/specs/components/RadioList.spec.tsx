import React from 'react';
import { render, fireEvent, act, screen } from 'jest-utils';
import { RadioList } from 'components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

describe('Small Radio List component', () => {
  const options = ['Option 1', 'Option 2', 'Option 3'];

  test('renders the radio buttons', async () => {
    await act(async () => {
      render(
        <RadioList
          name="radioGroup"
          label="Choose an option"
          options={options}
          onChange={jest.fn()}
        />,
      );
    });

    expect(screen.getByText('Choose an option')).toBeTruthy();

    for (const option of options) {
      expect(screen.getByText(option)).toBeTruthy();
    }
  });

  test('calls onChange callback when a radio button is selected', async () => {
    const handleChange = jest.fn();

    await act(async () => {
      render(
        <RadioList
          name="radioGroup"
          label="Choose an option"
          options={options}
          onChange={handleChange}
        />,
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByLabelText(options[1]));
    });

    expect(handleChange).toHaveBeenCalledWith(expect.any(Object));
    expect(handleChange.mock.calls[0][0].target.value).toBe(options[1]);
  });

  test('displays error message if errorMessage prop is provided', async () => {
    const errorMessage = 'This field is required';

    await act(async () => {
      render(
        <RadioList
          name="radioGroup"
          label="Choose an option"
          options={options}
          errorMessage={errorMessage}
          onChange={jest.fn()}
        />,
      );
    });

    expect(screen.getByText(errorMessage)).toBeTruthy();
  });
});
