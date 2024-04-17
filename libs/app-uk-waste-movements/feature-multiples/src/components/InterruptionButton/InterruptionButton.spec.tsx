import { render, screen, fireEvent } from '@testing-library/react';
import { InterruptionButton } from './InterruptionButton';
import { useRouter } from '@wts/ui/navigation';
import '@testing-library/jest-dom';

jest.mock('@wts/ui/navigation');

describe('InterruptionButton component', () => {
  it('Renders with a label from props', () => {
    const mockRefresh = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      refresh: mockRefresh,
    });

    render(<InterruptionButton label="Test Label" />);
    const button = screen.getByRole('button', { name: 'Test Label' });
    expect(button).toBeInTheDocument();
  });
  it('Calls router refresh function when button is clicked', () => {
    const mockRefresh = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      refresh: mockRefresh,
    });

    render(<InterruptionButton label="Test Label" />);
    const button = screen.getByRole('button', { name: 'Test Label' });

    fireEvent.click(button);
    expect(mockRefresh).toHaveBeenCalled();
  });
});
