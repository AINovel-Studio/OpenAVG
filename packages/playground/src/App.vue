<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { openAVGCore } from '@openavg/core'
import { computed, onMounted, ref } from 'vue'
import { fetchChapter, fetchChapterAssets, fetchGlobalConfig } from './api'
import GameStage from './components/GameStage.vue'
import PixiCanvas from './components/PixiCanvas.vue'
import RotateButton from './components/RotateButton.vue'
import { useGameRotation } from './composables/useGameRotation'

const GAME_WIDTH = 1920
const GAME_HEIGHT = 1080

const { rotation, isTransitioning, isHorizontal } = useGameRotation()
const { width: vw, height: vh } = useWindowSize()

const gameStyle = computed<CSSProperties>(() => {
  const scale = isHorizontal.value
    ? Math.min(vw.value / GAME_WIDTH, vh.value / GAME_HEIGHT)
    : Math.min(vw.value / GAME_HEIGHT, vh.value / GAME_WIDTH)

  return {
    width: `${GAME_WIDTH}px`,
    height: `${GAME_HEIGHT}px`,
    transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation.value}deg)`,
    transition: isTransitioning.value
      ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'none',
  }
})

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
  <div id="game-viewport">
    <div
      class="game-content"
      :style="gameStyle"
    >
      <PixiCanvas @ready="onPixiReady" />
      <GameStage v-if="isInit" />
    </div>
    <RotateButton />
  </div>
</template>

<style>
#app,
#game-viewport {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: black;
}

#game-viewport {
  position: relative;
}

.game-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: center center;
}
</style>
