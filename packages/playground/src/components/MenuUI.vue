<script setup lang="ts">
import { mainMenuActions } from 'openavg'

const buttons = [
  { name: 'Fullscreen', onClick: () => mainMenuActions.onFullScreen() },
  { name: 'Load', onClick: () => mainMenuActions.onLoad() },
  { name: 'Save', onClick: () => mainMenuActions.onSave() },
  { name: 'Configs', onClick: () => mainMenuActions.onConfig() },
  { name: 'Title', onClick: () => mainMenuActions.onTitle() },
  { name: 'Exit', onClick: () => mainMenuActions.onExit() },
]
</script>

<template>
  <div class="position-absolute bottom-1 w-full">
    <div class="flex justify-center items-center">
      <button
        v-for="(btn, index) in buttons"
        :key="index"
        class="border-none w-120px bg-transparent c-white cursor-pointer font-size-16px py-2 px-4 hover:c-pink-300 transition-colors"
        @click="btn.onClick"
      >
        {{ btn.name }}
      </button>
    </div>
  </div>
</template>
