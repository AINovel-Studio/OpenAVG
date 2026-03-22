<script setup lang="ts">
import {
  eventManager,
  stageManager,
  StageType,
} from '@openavg/core'
import { onMounted, onUnmounted, ref } from 'vue'
import ArchiveMenu from './ArchiveMenu.vue'
import ConfigMenu from './ConfigMenu.vue'
import MainMenu from './MainMenu.vue'
import MenuUI from './MenuUI.vue'

const currentStage = ref<StageType>(stageManager.currentStage)
const isReady = ref(false)
const isVideoPlaying = ref(false)

function skipVideo() {
  stageManager.skipVideo()
}

onMounted(async () => {
  eventManager.install({
    name: 'videoPlay',
    event: () => {
      isVideoPlaying.value = true
    },
  })

  eventManager.install({
    name: 'videoEnd',
    event: () => {
      isVideoPlaying.value = false
    },
  })

  await stageManager.render()
  isReady.value = true

  eventManager.install({
    name: 'currentStageUpdated',
    event: () => {
      currentStage.value = stageManager.currentStage
    },
  })
})

onUnmounted(() => {
  eventManager.uninstall('currentStageUpdated')
  eventManager.uninstall('videoPlay')
  eventManager.uninstall('videoEnd')
})
</script>

<template>
  <template v-if="isReady">
    <MainMenu />
    <ArchiveMenu />
    <ConfigMenu />
    <MenuUI v-if="currentStage === StageType.NOVEL" />
  </template>
  <div
    v-show="isVideoPlaying"
    class="fixed top-0 left-0 z-100 w-full h-full transition-opacity"
    @click="skipVideo"
  />
</template>
