import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
// @ts-expect-error: required for tests to pass
global.TextDecoder = TextDecoder;
