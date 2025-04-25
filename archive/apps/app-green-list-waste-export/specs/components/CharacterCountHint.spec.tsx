import '@testing-library/jest-dom';
import { render, queryByAttribute, screen, act } from 'jest-utils';
import { CharacterCountHint } from 'components/CharacterCountHint';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

describe('CharacterCountHint component', () => {
  it('Renders without errors', async () => {
    await act(async () => {
      render(
        <CharacterCountHint currentCount={0} maxCount={100} id="test-id" />,
      );
    });
  });

  it('Renders with correct HTML Id from props', async () => {
    const getById = queryByAttribute.bind(null, 'id');
    let container: HTMLElement;

    await act(async () => {
      container = render(
        <CharacterCountHint currentCount={0} maxCount={100} id="test-id" />,
      ).container;
    });

    const element = getById(container, 'test-id');

    expect(element).toBeTruthy();
  });

  it("Displays the correct text and count when there's characters remaining", async () => {
    await act(async () => {
      render(
        <CharacterCountHint currentCount={0} maxCount={100} id="test-id" />,
      );
    });

    const hint = screen.getByText('You have 100 characters remaining');

    expect(hint).toBeInTheDocument();
  });

  it('Displays the correct text and count when the maximum characters have been exceeded', async () => {
    await act(async () => {
      render(
        <CharacterCountHint currentCount={101} maxCount={100} id="test-id" />,
      );
    });

    const hint = screen.getByText('You have 1 characters too many');

    expect(hint).toBeInTheDocument();
  });

  it('Displays red text when maximum characters have been exceeded', async () => {
    await act(async () => {
      render(
        <CharacterCountHint currentCount={101} maxCount={100} id="test-id" />,
      );
    });

    const hint = screen.getByText('You have 1 characters too many');

    expect(hint).toHaveStyle('color: #d4351c');
  });

  it('Displays text in bold when maximum characters have been exceeded', async () => {
    await act(async () => {
      render(
        <CharacterCountHint currentCount={101} maxCount={100} id="test-id" />,
      );
    });

    const hint = screen.getByText('You have 1 characters too many');

    expect(hint).toHaveStyle('font-weight: 700');
  });
});
