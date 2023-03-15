import { render, screen } from '@testing-library/react';
import SubmitAnExport from '../../pages/dashboard/submit-an-export';

describe('Index', () => {
  it('renders Green list waste overview page', () => {
    const { baseElement } = render(<SubmitAnExport />);
    expect(baseElement).toBeTruthy();
    expect(screen.findByText('Submit an export')).toBeTruthy();
  });
});
