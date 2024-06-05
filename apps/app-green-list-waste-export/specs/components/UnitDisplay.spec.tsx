import React from 'react';
import { render, act } from 'jest-utils';
import { UnitDisplay } from 'components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

describe('UnitDisplay', () => {
  it('displays "kg" when type is "NotApplicable" and quantityType is "Weight"', async () => {
    let container: HTMLElement;

    await act(async () => {
      container = render(
        <UnitDisplay type="NotApplicable" quantityType="Weight" />,
      ).container;
    });

    const unitSpan = container.querySelector('span');

    expect(unitSpan.textContent).toBe(' kg ');
  });

  it('displays "tonnes" when type is not "NotApplicable" and quantityType is "Weight"', async () => {
    let container: HTMLElement;

    await act(async () => {
      container = render(
        <UnitDisplay type="SomeType" quantityType="Weight" />,
      ).container;
    });

    const unitSpan = container.querySelector('span');

    expect(unitSpan.textContent).toBe(' tonnes ');
  });

  it('displays "m3" when type is not "NotApplicable" and quantityType is "Volume"', async () => {
    let container: HTMLElement;
    await act(async () => {
      container = render(
        <UnitDisplay type="SomeType" quantityType="Volume" />,
      ).container;
    });

    const unitSpan = container.querySelector('span');
    expect(unitSpan.textContent).toBe(' m3 ');
  });
});
