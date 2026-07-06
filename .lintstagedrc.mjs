export default {
  // Sanity Studio (repo root) source files
  '{schemaTypes,components}/**/*.{ts,tsx}': ['eslint --fix'],
  '*.ts': ['eslint --fix'],

  // Next.js website — must run through web/'s own eslint config (Next + React Hooks rules)
  'web/src/**/*.{ts,tsx}': (filenames) => {
    const relative = filenames.map((f) => f.replace(/^.*[\\/]web[\\/]/, ''))
    return `npm --prefix web run lint -- --fix ${relative.map((f) => `"${f}"`).join(' ')}`
  },
}
