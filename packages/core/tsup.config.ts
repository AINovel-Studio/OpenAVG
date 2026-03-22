import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  outDir: 'dist',
  format: ['esm'],
  splitting: true,
  sourcemap: true,
  clean: true,
  tsconfig: 'tsconfig.json',
  external: ['pixi.js', '@pixi/sound'],
  treeshake: true,
  esbuildOptions(options) {
    options.alias = {
      '@': './src',
    }
  },
})
