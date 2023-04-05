import React from "react";
import { render } from '@testing-library/react';
import { WasteCode } from "../pages/waste-code";

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({ query: {} })),
}));

describe("WasteCode", () => {

  it("renders without crashing", () => {
    render(<WasteCode />);
  });

});
