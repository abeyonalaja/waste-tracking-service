import '@testing-library/jest-dom';
import { render, screen, act } from 'jest-utils';
import SubmitErrorPage from '../../../pages/multiples/[id]/submit/error';

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: 'NotStarted' }),
    }) as Promise<Response>
);

describe('Submission error page', () => {
  it('displays an h1 informing user of error', async () => {
    await act(async () => {
      render(<SubmitErrorPage />);
    });

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toHaveTextContent(
      'Sorry, there is a problem with this service'
    );
  });

  it('displays a link with text and href matching the waste user research email address', async () => {
    await act(async () => {
      render(<SubmitErrorPage />);
    });

    const link = screen.getByRole('link', {
      name: 'wasteuserresearch@defra.gov.uk',
    });
    expect(link).toHaveAttribute(
      'href',
      'mailto:wasteuserresearch@defra.gov.uk'
    );
  });
});
