<script setup lang="ts">
import { menuActions } from '@openavg/core'
import { useGameFullscreen } from '../composables/useGameFullscreen'

const { toggle: toggleFullscreen } = useGameFullscreen()

const buttons = [
  { name: 'Fullscreen', onClick: () => toggleFullscreen() },
  { name: 'Load', onClick: () => menuActions.onLoad() },
  { name: 'Save', onClick: () => menuActions.onSave() },
  { name: 'Configs', onClick: () => menuActions.onConfig() },
  { name: 'Title', onClick: () => menuActions.onTitle() },
  { name: 'Exit', onClick: () => menuActions.onExit() },
]
</script>

<template>
  <div class="position-absolute bottom-1 w-full">
    <div class="flex justify-center items-center">
      <button
        v-for="(btn, index) in buttons"
        :key="index"
        class="border-none w-120px bg-transparent c-white cursor-pointer font-size-20px py-12px ml-10px hover:c-pink-300 transition-colors"
        @click="btn.onClick"
      >
        {{ btn.name }}
      </button>
    </div>
  </div>
</template>
