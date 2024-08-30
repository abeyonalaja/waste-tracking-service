import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { List, ListStrings } from './_List';

window.scrollTo = jest.fn();

const mockAddedCodes = [
  {
    code: '06200',
    description: 'Extraction of natural gas',
  },
  {
    code: '01500',
    description: 'Mixed farming',
  },
  {
    code: '08930',
    description: 'Extraction of salt',
  },
];

const strings: ListStrings = {
  remove: 'Remove',
  hidden: 'SIC Code',
};

describe('SIC Code List component', () => {
  it('displays SIC code codes', () => {
    render(
      <List
        addedCodes={mockAddedCodes}
        strings={strings}
        setCodeToRemove={jest.fn()}
      />,
    );

    expect(screen.getByText(/^06200$/)).toBeInTheDocument();
    expect(screen.getByText(/^01500$/)).toBeInTheDocument();
    expect(screen.getByText(/^08930$/)).toBeInTheDocument();
  });

  it('renders SIC code descriptions', () => {
    render(
      <List
        addedCodes={mockAddedCodes}
        strings={strings}
        setCodeToRemove={jest.fn()}
      />,
    );

    expect(screen.getByText(/Extraction of natural gas/)).toBeInTheDocument();
    expect(screen.getByText(/Mixed farming/)).toBeInTheDocument();
    expect(screen.getByText(/Extraction of salt/)).toBeInTheDocument();
  });

  it('displays a visible remove link for each SIC code', () => {
    render(
      <List
        addedCodes={mockAddedCodes}
        strings={strings}
        setCodeToRemove={jest.fn()}
      />,
    );

    expect(
      screen.getAllByRole('link', { name: /Remove SIC Code/ }),
    ).toHaveLength(3);
  });

  it('calls setCodeToRemove when remove link is clicked', async () => {
    const user = userEvent.setup();

    const setCodeToRemove = jest.fn();
    render(
      <List
        addedCodes={mockAddedCodes}
        strings={strings}
        setCodeToRemove={setCodeToRemove}
      />,
    );

    await user.click(
      screen.getAllByRole('link', { name: /Remove SIC Code/ })[0],
    );

    expect(setCodeToRemove).toHaveBeenCalledWith('06200');
  });
});
