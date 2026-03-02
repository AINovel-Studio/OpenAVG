<script setup lang="ts">
import { openAVGCore } from 'openavg'
import { computed, onMounted, ref } from 'vue'
import { fetchChapter, fetchChapterAssets, fetchGlobalConfig } from './api'
import GameStage from './components/GameStage.vue'
import PixiCanvas from './components/PixiCanvas.vue'

const coreReady = ref(false)
const pixiReady = ref(false)
const isInit = computed(() => coreReady.value && pixiReady.value)

async function initCore() {
  const config = await fetchGlobalConfig()
  if (config) {
    await openAVGCore.init({
      globalConfig: config,
      apiCore: {
        fetchChapter,
        fetchChapterAssets,
        fetchGlobalConfig,
      },
    })
    coreReady.value = true
  }
}

function onPixiReady() {
  pixiReady.value = true
}

onMounted(() => {
  initCore()
})
</script>

<template>
  <div id="game-root">
    <PixiCanvas @ready="onPixiReady" />
    <GameStage v-if="isInit" />
  </div>
</template>

<style>
#app,
#game-root {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
