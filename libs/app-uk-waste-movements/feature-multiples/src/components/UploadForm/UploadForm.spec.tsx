import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { UploadForm } from './UploadForm';

jest.mock('@wts/ui/navigation', () => ({
  useRouter: (): null => null,
}));

// Second mock of useRouter is required for tests involving the ErrorSummary component
jest.mock('next/navigation', () => ({
  useRouter: (): null => null,
}));

const strings = {
  heading: 'Upload your CSV file',
  hint: 'You need to review and check for errors before uploading',
  button: 'Upload',
  errorLabel: 'Error: ',
  summaryLabel: 'There is a problem',
};

function MockChild(): JSX.Element {
  return <div> Mock Child</div>;
}

describe('UploadForm component', () => {
  test('renders instructions', () => {
    render(
      <UploadForm token="#" strings={strings}>
        <MockChild />
      </UploadForm>,
    );
  });

  test('contains an h2 heading with string from props', () => {
    render(
      <UploadForm token="#" strings={strings}>
        <MockChild />
      </UploadForm>,
    );

    const heading = screen.getByRole('heading', {
      name: 'Upload your CSV file',
    });

    expect(heading).toBeInTheDocument();
  });

  test('contains a button with string from props', () => {
    render(
      <UploadForm token="#" strings={strings}>
        <MockChild />
      </UploadForm>,
    );

    const uploadButton = screen.getByRole('button', { name: 'Upload' });

    expect(uploadButton).toBeInTheDocument();
  });

  test('displays validation errors from props', () => {
    render(
      <UploadForm
        token="#"
        strings={strings}
        validationError="Incorrect columns"
      >
        <MockChild />
      </UploadForm>,
    );

    const validationError = screen.getAllByText('Incorrect columns');

    expect(validationError).toHaveLength(2);
  });
});
