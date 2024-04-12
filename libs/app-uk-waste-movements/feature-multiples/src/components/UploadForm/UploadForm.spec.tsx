import { render, screen } from '@testing-library/react';
import { UploadForm } from './UploadForm';
import '@testing-library/jest-dom';

const strings = {
  heading: 'Upload your CSV file',
  hint: 'You need to review and check for errors before uploading',
  button: 'Upload',
};

function MockChild() {
  return <div> Mock Child</div>;
}

describe('UploadForm component', () => {
  test('renders instructions', () => {
    render(
      <UploadForm strings={strings}>
        <MockChild />
      </UploadForm>
    );
  });

  test('contains an h2 heading with string from props', () => {
    render(
      <UploadForm strings={strings}>
        <MockChild />
      </UploadForm>
    );

    const heading = screen.getByRole('heading', {
      name: 'Upload your CSV file',
    });

    expect(heading).toBeInTheDocument();
  });

  test('contains a button with string from props', () => {
    render(
      <UploadForm strings={strings}>
        <MockChild />
      </UploadForm>
    );

    const uploadButton = screen.getByRole('button', { name: 'Upload' });

    expect(uploadButton).toBeInTheDocument();
  });
});
