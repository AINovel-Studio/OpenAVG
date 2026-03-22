import panzerjack from '@panzerjack/eslint-config'

export default panzerjack({
  typescript: true,
  pnpm: true,
  formatters: true,
  markdown: false,
  rules: {
    "pnpm/json-enforce-catalog": "off",
    'no-console': 'off',
    'no-irregular-whitespace': 'off',
    'style/no-tabs': 'off',
    'style/no-mixed-spaces-and-tabs': 'off',
  },
})
