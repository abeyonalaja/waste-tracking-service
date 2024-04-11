import '@testing-library/jest-dom';
import { render, screen, act } from '../../jest-utils';
import { SubmissionDeclaration } from 'features/multiples';

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(() => Promise.resolve({ id_token: 'dummytoken' })),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  })
);

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: 'NotStarted' }),
    }) as Promise<Response>
);

describe('SubmissionDeclaration component', () => {
  it('Renders without errors', async () => {
    await act(async () => {
      render(<SubmissionDeclaration recordCount={1} hasEstimates={false} />);
    });
  });

  it('Displays the correct heading text submission', async () => {
    await act(async () => {
      render(<SubmissionDeclaration recordCount={20} hasEstimates={false} />);
    });

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toHaveTextContent('Submit all 20 Annex VII records');
  });

  it('Renders the esimates banner text when there are estimates in the submission', async () => {
    await act(async () => {
      render(<SubmissionDeclaration recordCount={20} hasEstimates={true} />);
    });

    const banner = screen.getByText(
      "You'll need to update any estimated details in your records with actual details as soon possible after submitting."
    );

    expect(banner).toBeInTheDocument();
  });

  it('Does not render the esimates banner text when there are not estimates in the submission', async () => {
    await act(async () => {
      render(<SubmissionDeclaration recordCount={20} hasEstimates={false} />);
    });

    const banner = screen.queryByText(
      "You'll need to update any estimated details in your records with actual details as soon possible after submitting."
    );

    expect(banner).not.toBeInTheDocument();
  });

  it('Displays effective contract text when there are estimates in the submission', async () => {
    await act(async () => {
      render(<SubmissionDeclaration recordCount={20} hasEstimates={true} />);
    });

    const effectiveText = screen.getByText(
      'there are effective written contractual obligations with the consignees'
    );

    expect(effectiveText).toBeInTheDocument();
  });

  it('Does not display effective contract text when there are not estimates in the submission', async () => {
    await act(async () => {
      render(<SubmissionDeclaration recordCount={20} hasEstimates={false} />);
    });

    const effectiveText = screen.queryByText(
      'there are effective written contractual obligations with the consignees'
    );

    expect(effectiveText).not.toBeInTheDocument();
  });
});
