import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
  ],
  shims: true,
  format: ['esm'],
  exports: true,
  clean: true,
  dts: true,
  external: ['canvas', 'img-ascii-term'],
})
