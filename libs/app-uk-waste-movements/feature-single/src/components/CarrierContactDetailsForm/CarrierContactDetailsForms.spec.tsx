import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { CarrierContactDetailsForm } from './CarrierContactDetailsForm';
import userEvent from '@testing-library/user-event';

const formStrings = {
  errorSummaryHeading: 'There is a problem',
  labelOne: 'Full name of organisation',
  labelTwo: 'Organisation contact person',
  hintOne: 'Full name',
  labelThree: 'Email address',
  labelFour: 'Phone number',
  hintTwo: 'Include the area or country code',
  labelFive: 'Fax number (optional)',
  buttonOne: 'Save and continue',
  buttonTwo: 'Save and return',
};

window.scrollTo = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ id: '1234' }),
  }),
) as jest.Mock;

describe('ProducerContactDetailsForm', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders child elements', () => {
    render(
      <CarrierContactDetailsForm
        id="123"
        token="123ABC"
        formStrings={formStrings}
        initialFormState={{}}
        section={'Carrier'}
      >
        <p>This is a child element</p>
      </CarrierContactDetailsForm>,
    );

    expect(screen.getByText('This is a child element')).toBeInTheDocument();
  });

  it('renders the form with the labels and hints', () => {
    render(
      <CarrierContactDetailsForm
        id="123"
        token="123ABC"
        formStrings={formStrings}
        initialFormState={{}}
        section={'Carrier'}
      >
        <p>Child element</p>
      </CarrierContactDetailsForm>,
    );

    const labelOne = screen.getByLabelText('Full name of organisation');
    const labelTwo = screen.getByLabelText('Organisation contact person');
    const hintOne = screen.getByText('Full name');
    const labelThree = screen.getByLabelText('Email address');
    const labelFour = screen.getByLabelText('Phone number');
    const hintTwo = screen.getByText('Include the area or country code');
    const labelFive = screen.getByLabelText('Fax number (optional)');

    expect(labelOne).toBeInTheDocument();
    expect(labelTwo).toBeInTheDocument();
    expect(hintOne).toBeInTheDocument();
    expect(labelThree).toBeInTheDocument();
    expect(labelFour).toBeInTheDocument();
    expect(hintTwo).toBeInTheDocument();
    expect(labelFive).toBeInTheDocument();
  });

  it('renders the form with buttons', () => {
    render(
      <CarrierContactDetailsForm
        id="123"
        token="123ABC"
        formStrings={formStrings}
        initialFormState={{}}
        section={'Carrier'}
      >
        <p>Child element</p>
      </CarrierContactDetailsForm>,
    );

    const buttonOne = screen.getByRole('button', { name: 'Save and continue' });
    const buttonTwo = screen.getByRole('button', { name: 'Save and return' });

    expect(buttonOne).toBeInTheDocument();
    expect(buttonTwo).toBeInTheDocument();
  });

  it('renders input fields', () => {
    render(
      <CarrierContactDetailsForm
        id="123"
        token="123ABC"
        formStrings={formStrings}
        initialFormState={{}}
        section={'Carrier'}
      >
        <p>Child element</p>
      </CarrierContactDetailsForm>,
    );

    const input = screen.getAllByRole('textbox');
    expect(input).toHaveLength(5);
  });

  it('renders the form with blank inputs when not provided any initial state', () => {
    render(
      <CarrierContactDetailsForm
        id="123"
        token="123ABC"
        formStrings={formStrings}
        initialFormState={{}}
        section={'Carrier'}
      >
        <p>Child element</p>
      </CarrierContactDetailsForm>,
    );

    const input = screen.getAllByRole('textbox');
    expect(input[0]).toHaveValue('');
    expect(input[1]).toHaveValue('');
    expect(input[2]).toHaveValue('');
    expect(input[3]).toHaveValue('');
    expect(input[4]).toHaveValue('');
  });

  it('renders the form with pre-populated inputs when provided initial state', () => {
    render(
      <CarrierContactDetailsForm
        id="123"
        token="123ABC"
        formStrings={formStrings}
        initialFormState={{
          organisationName: 'Test Organisation',
          organisationContactPerson: 'Test Person',
          emailAddress: 'person@test.com',
          phoneNumber: '0123456789',
          faxNumber: '098765432',
        }}
        section={'Carrier'}
      >
        <p>Child element</p>
      </CarrierContactDetailsForm>,
    );

    const input = screen.getAllByRole('textbox');
    expect(input[0]).toHaveValue('Test Organisation');
    expect(input[1]).toHaveValue('Test Person');
    expect(input[2]).toHaveValue('person@test.com');
    expect(input[3]).toHaveValue('0123456789');
    expect(input[4]).toHaveValue('098765432');
  });

  it('it displays the heading for the error summary when there are errors', async () => {
    const user = userEvent.setup();

    render(
      <CarrierContactDetailsForm
        id="123"
        token="123ABC"
        formStrings={formStrings}
        initialFormState={{}}
        section={'Carrier'}
      >
        <p>Child element</p>
      </CarrierContactDetailsForm>,
    );

    const saveAndContinueButton = screen.getByRole('button', {
      name: 'Save and continue',
    });

    await user.click(saveAndContinueButton);
    const errorSummaryHeading = screen.getByRole('heading', {
      level: 2,
      name: 'There is a problem',
    });

    expect(errorSummaryHeading).toBeInTheDocument();
  });

  it('it displays the error messages for empty inputs', async () => {
    const user = userEvent.setup();

    render(
      <CarrierContactDetailsForm
        id="123"
        token="123ABC"
        formStrings={formStrings}
        initialFormState={{}}
        section={'Carrier'}
      >
        <p>Child element</p>
      </CarrierContactDetailsForm>,
    );

    const saveAndContinueButton = screen.getByRole('button', {
      name: 'Save and continue',
    });

    await user.click(saveAndContinueButton);

    const emptyOrganisationNameMessages = screen.getAllByText(
      /Enter an organisation name/,
    );
    const emptyContactPersonMessages = screen.getAllByText(
      /Enter an organisation contact person/,
    );
    const emptyEmailMessages = screen.getAllByText(/Enter an email address/);
    const emptyPhoneMessages = screen.getAllByText(/Enter a phone number/);

    expect(emptyOrganisationNameMessages).toHaveLength(2);
    expect(emptyContactPersonMessages).toHaveLength(2);
    expect(emptyEmailMessages).toHaveLength(2);
    expect(emptyPhoneMessages).toHaveLength(2);
  });

  it('displays error messages if organisation name exceeds the max length', async () => {
    const user = userEvent.setup();

    render(
      <CarrierContactDetailsForm
        id="123"
        token="123ABC"
        formStrings={formStrings}
        initialFormState={{}}
        section={'Carrier'}
      >
        <p>Child element</p>
      </CarrierContactDetailsForm>,
    );

    const saveAndContinueButton = screen.getByRole('button', {
      name: 'Save and continue',
    });
    const input = screen.getByLabelText('Full name of organisation');

    await user.type(input, 'a'.repeat(251));
    await user.click(saveAndContinueButton);

    const organisationNameMessages = screen.getAllByText(
      /The organisation name can only be 250 characters or less/,
    );

    expect(organisationNameMessages).toHaveLength(2);
  });

  it('displays error messages if organisation contact person name exceeds the max length', async () => {
    const user = userEvent.setup();

    render(
      <CarrierContactDetailsForm
        id="123"
        token="123ABC"
        formStrings={formStrings}
        initialFormState={{}}
        section={'Carrier'}
      >
        <p>Child element</p>
      </CarrierContactDetailsForm>,
    );

    const saveAndContinueButton = screen.getByRole('button', {
      name: 'Save and continue',
    });
    const input = screen.getByLabelText('Organisation contact person');

    await user.type(input, 'a'.repeat(251));
    await user.click(saveAndContinueButton);

    const organisationNameMessages = screen.getAllByText(
      /The organisation contact person can only be 250 characters or less/,
    );

    expect(organisationNameMessages).toHaveLength(2);
  });

  it('displays error messages if organisation email exceeds the max length', async () => {
    const user = userEvent.setup();

    render(
      <CarrierContactDetailsForm
        id="123"
        token="123ABC"
        formStrings={formStrings}
        initialFormState={{}}
        section={'Carrier'}
      >
        <p>Child element</p>
      </CarrierContactDetailsForm>,
    );

    const saveAndContinueButton = screen.getByRole('button', {
      name: 'Save and continue',
    });
    const input = screen.getByLabelText('Email address');

    await user.type(input, `${'a'.repeat(251)}@test.com`);
    await user.click(saveAndContinueButton);

    const organisationNameMessages = screen.getAllByText(
      /The organisation contact email can only be 250 characters or less/,
    );

    expect(organisationNameMessages).toHaveLength(2);
  });

  it('displays error messages if the email address is invalid', async () => {
    const user = userEvent.setup();

    render(
      <CarrierContactDetailsForm
        id="123"
        token="123ABC"
        formStrings={formStrings}
        initialFormState={{}}
        section={'Carrier'}
      >
        <p>Child element</p>
      </CarrierContactDetailsForm>,
    );

    const saveAndContinueButton = screen.getByRole('button', {
      name: 'Save and continue',
    });
    const input = screen.getByLabelText('Email address');

    await user.type(input, 'a'.repeat(10));
    await user.click(saveAndContinueButton);

    const organisationNameMessages = screen.getAllByText(
      /Enter an email address in the correct format, like name@example.com/,
    );

    expect(organisationNameMessages).toHaveLength(2);
  });

  it('displays error messages if the phone number is invalid', async () => {
    const user = userEvent.setup();

    render(
      <CarrierContactDetailsForm
        id="123"
        token="123ABC"
        formStrings={formStrings}
        initialFormState={{}}
        section={'Carrier'}
      >
        <p>Child element</p>
      </CarrierContactDetailsForm>,
    );

    const saveAndContinueButton = screen.getByRole('button', {
      name: 'Save and continue',
    });
    const input = screen.getByLabelText('Phone number');

    await user.type(input, '__11__"£"££$');
    await user.click(saveAndContinueButton);

    const organisationNameMessages = screen.getAllByText(
      /Enter a phone number only using numbers, spaces, dashes, pluses and brackets/,
    );

    expect(organisationNameMessages).toHaveLength(2);
  });

  it('displays error messages if the fax field is invalid', async () => {
    const user = userEvent.setup();

    render(
      <CarrierContactDetailsForm
        id="123"
        token="123ABC"
        formStrings={formStrings}
        initialFormState={{}}
        section={'Carrier'}
      >
        <p>Child element</p>
      </CarrierContactDetailsForm>,
    );

    const saveAndContinueButton = screen.getByRole('button', {
      name: 'Save and continue',
    });
    const input = screen.getByLabelText('Fax number (optional)');

    await user.type(input, '__11__"£"££$');
    await user.click(saveAndContinueButton);

    const organisationNameMessages = screen.getAllByText(
      /Enter a fax number only using numbers, spaces, dashes, pluses and brackets/,
    );

    expect(organisationNameMessages).toHaveLength(2);
  });
});
