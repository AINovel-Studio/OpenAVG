<script setup lang="ts">
import { openAVGCore } from '@openavg/core'
import { onMounted, ref } from 'vue'

const emit = defineEmits<{
  ready: []
}>()

const canvasRef = ref<HTMLCanvasElement>()

onMounted(async () => {
  if (canvasRef.value) {
    await openAVGCore.pixiInstance.install(canvasRef.value)
    emit('ready')
  }
})
</script>

<template>
  <canvas
    id="pixi-canvas"
    ref="canvasRef"
    style="width: 100%; height: 100%; touch-action: none"
  />
</template>
