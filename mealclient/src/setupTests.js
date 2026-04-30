import '@testing-library/jest-dom';

// Silence specific MUI-related React warnings in tests
const originalError = console.error;
console.error = (...args) => {
  if (
    /React does not recognize the `.*` prop on a DOM element/.test(args[0]) ||
    /Invalid value for prop `.*` on <.*> tag/.test(args[0])
  ) {
    return;
  }
  originalError.call(console, ...args);
};
