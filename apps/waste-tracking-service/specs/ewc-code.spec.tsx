import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import EwcCode from '../pages/dashboard/ewc-code';

describe('EwcCode component', () => {
  it('should render the component', () => {
    render(<EwcCode />);
    const header = screen.getByRole('heading', { name: 'EWC Code' });
    expect(header).toBeInTheDocument();
  });

  it('should call the fetch function when component is mounted', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(React, 'useReducer').mockReturnValueOnce([null, mockDispatch]);
    jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

    render(<EwcCode />);
    await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(1));
  });

  it('should call the PUT method when form is submitted', async () => {
    const mockPush = jest.fn();
    const mockFetch = jest.fn().mockResolvedValueOnce({ ok: true });
    jest.spyOn(React, 'useCallback').mockImplementation((f) => f);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest
      .spyOn(React, 'useReducer')
      .mockReturnValueOnce([
        { data: {}, isLoading: false, isError: false },
        jest.fn(),
      ]);
    jest.spyOn(React, 'useRouter').mockReturnValueOnce({
      isReady: true,
      query: { id: '123' },
      push: mockPush,
    });
    jest.spyOn(window, 'fetch').mockImplementationOnce(mockFetch);

    render(<EwcCode />);
    const saveAndReturnLink = screen.getByText('Save and return later');
    fireEvent.click(saveAndReturnLink);

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
    expect(mockFetch.mock.calls[0][1].method).toBe('PUT');
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/submit-an-export-tasklist',
      query: { id: '123' },
    });
  });
});
