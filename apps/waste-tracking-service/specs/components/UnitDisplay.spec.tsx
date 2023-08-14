import React from 'react';
import { render } from '@testing-library/react';
import { UnitDisplay } from 'components';

describe('UnitDisplay', () => {
  it('displays "kg" when type is "NotApplicable" and quantityType is "Weight"', () => {
    const { container } = render(
      <UnitDisplay type="NotApplicable" quantityType="Weight" />
    );
    const unitSpan = container.querySelector('span');
    expect(unitSpan.textContent).toBe(' kg ');
  });

  it('displays "tonnes" when type is not "NotApplicable" and quantityType is "Weight"', () => {
    const { container } = render(
      <UnitDisplay type="SomeType" quantityType="Weight" />
    );
    const unitSpan = container.querySelector('span');
    expect(unitSpan.textContent).toBe(' tonnes ');
  });

  it('displays "m3" when type is not "NotApplicable" and quantityType is "Volume"', () => {
    const { container } = render(
      <UnitDisplay type="SomeType" quantityType="Volume" />
    );
    const unitSpan = container.querySelector('span');
    expect(unitSpan.textContent).toBe(' m3 ');
  });
});
