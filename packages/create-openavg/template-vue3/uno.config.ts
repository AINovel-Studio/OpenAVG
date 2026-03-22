import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      'primary': 'rgb(209, 96, 112)',
      'primary-hover': 'rgb(255, 130, 150)',
      'primary-active': 'rgb(180, 70, 90)',
    },
  },
})
