import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { SmallRadioList } from '../../components/';

describe('Small Radio List component', () => {
  const options = ['Option 1', 'Option 2', 'Option 3'];

  test('renders the radio buttons', () => {
    const { getByText } = render(
      <SmallRadioList
        name="radioGroup"
        label="Choose an option"
        options={options}
        onChange={jest.fn()}
      />
    );

    expect(getByText('Choose an option')).toBeTruthy();

    options.forEach((option) => {
      expect(getByText(option)).toBeTruthy();
    });
  });

  test('calls onChange callback when a radio button is selected', () => {
    const handleChange = jest.fn();

    const { getByLabelText } = render(
      <SmallRadioList
        name="radioGroup"
        label="Choose an option"
        options={options}
        onChange={handleChange}
      />
    );

    fireEvent.click(getByLabelText(options[1]));

    expect(handleChange).toHaveBeenCalledWith(expect.any(Object));
    expect(handleChange.mock.calls[0][0].target.value).toBe(options[1]);
  });

  test('displays error message if errorMessage prop is provided', () => {
    const errorMessage = 'This field is required';
    const { getByText } = render(
      <SmallRadioList
        name="radioGroup"
        label="Choose an option"
        options={options}
        errorMessage={errorMessage}
        onChange={jest.fn()}
      />
    );
    expect(getByText(errorMessage)).toBeTruthy();
  });
});
