import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm'],
  dts: true,
  clean: true,
  shims: true,
  splitting: false,
  sourcemap: false,
  external: ['canvas', 'img-ascii-term'],
  outExtension() {
    return {
      js: '.mjs',
    }
  },
})
