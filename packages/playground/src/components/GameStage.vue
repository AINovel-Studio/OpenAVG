<script setup lang="ts">
import {
  eventManager,
  stageManager,
  StageType,
} from 'openavg'
import { onMounted, onUnmounted, ref } from 'vue'
import ArchiveMenu from './ArchiveMenu.vue'
import ConfigMenu from './ConfigMenu.vue'
import MenuUI from './MenuUI.vue'

const currentStage = ref<StageType>(stageManager.currentStage)

onMounted(() => {
  stageManager.render()

  eventManager.install({
    name: 'currentStageUpdated',
    event: () => {
      currentStage.value = stageManager.currentStage
    },
  })
})

onUnmounted(() => {
  eventManager.uninstall('currentStageUpdated')
})
</script>

<template>
  <ArchiveMenu />
  <ConfigMenu />
  <MenuUI v-if="currentStage === StageType.NOVEL" />
</template>
