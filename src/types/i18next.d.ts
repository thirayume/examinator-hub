// This file fixes the React 18 + react-i18next TypeScript compatibility issue
// https://github.com/i18next/react-i18next/issues/1543

import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

export {};
