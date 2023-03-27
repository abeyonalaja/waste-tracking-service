import { render, screen, within } from '@testing-library/react';
import { ConditionalRadioWrap } from '../../components/';

describe('ConditionalRadioWrap', () => {
  it("renders", () => {
    render(
      <ConditionalRadioWrap testId="testConditionalRadioWrap">
        <></>
      </ConditionalRadioWrap>
    )
    expect(screen.getByTestId("testConditionalRadioWrap")).toBeTruthy()
  })
  it("renders the children", () => {
    render(
      <ConditionalRadioWrap testId="testConditionalRadioWrap">
        <div data-testid="testRadioChild" />
      </ConditionalRadioWrap>
    )

    expect(
      within(screen.getByTestId("testConditionalRadioWrap")).getByTestId("testRadioChild")
    ).toBeTruthy()
  })
});
