import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Heading } from './Heading';

describe('Heading component', () => {
  it('renders with default props', () => {
    const { container } = render(<Heading>Default Heading</Heading>);
    const heading = container.querySelector('h1');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('govuk-heading-l');
    expect(heading).toHaveTextContent('Default Heading');
  });

  it('renders with specified size and level', () => {
    const { container } = render(
      <Heading size="s" level={3}>
        Small Heading
      </Heading>,
    );
    const heading = container.querySelector('h3');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('govuk-heading-s');
    expect(heading).toHaveTextContent('Small Heading');
  });

  it('renders with additional props', () => {
    const { container } = render(
      <Heading id="test-heading" data-testid="heading">
        Test Heading
      </Heading>,
    );
    const heading = container.querySelector('h1');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute('id', 'test-heading');
    expect(heading).toHaveAttribute('data-testid', 'heading');
  });
});
