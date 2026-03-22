<script setup lang="ts">
import type { SaveDataList } from '@openavg/core'
import { menuActions, openAVGCore, stageManager } from '@openavg/core'
import { computed, onMounted, ref } from 'vue'

const isShown = ref(true)
const saveDataList = ref<SaveDataList | null>(null)

const globalConfig = computed(() => openAVGCore.globalConfig)

const bgImage = computed(() => {
  const img = globalConfig.value?.assets?.images?.find(a => a.name === 'main-menu')
  return img ? `/${img.src}` : ''
})

const titleImage = computed(() => {
  const img = globalConfig.value?.assets?.images?.find(a => a.name === 'title')
  return img ? `/${img.src}` : ''
})

const hasSaveData = computed(() => !!(saveDataList.value && saveDataList.value[0]))

const buttons = computed(() => [
  {
    row: 1,
    items: [
      { name: 'Continue', disabled: !hasSaveData.value, onClick: () => saveDataList.value?.[0] && menuActions.onContinue(saveDataList.value[0]) },
      { name: 'Start', disabled: false, onClick: () => menuActions.onStart() },
      { name: 'Load', disabled: false, onClick: () => menuActions.onLoad(true) },
    ],
  },
  {
    row: 2,
    items: [
      { name: 'AfterStory', disabled: true, onClick: () => menuActions.onAFStory() },
      { name: 'Gallery', disabled: true, onClick: () => menuActions.onGallery() },
      { name: 'Config', disabled: false, onClick: () => menuActions.onConfig() },
      { name: 'Exit', disabled: false, onClick: () => menuActions.onExit() },
    ],
  },
])

const mainMenuMusic = computed(() => {
  const assetsPack = stageManager.assetsManager?.assetsPacks?.GLOBAL
  return assetsPack?.GAME_AUDIO?.['main-menu'] ?? null
})

function playBgm() {
  const music = mainMenuMusic.value
  if (music && !music.isPlaying) {
    music.loop = true
    stageManager.soundManager.playBgm(music)
  }
}

function stopBgm() {
  const music = mainMenuMusic.value
  if (music?.isPlaying) {
    music.stop()
  }
}

async function refreshSaveData() {
  saveDataList.value = await menuActions.getSaveDataList()
}

menuActions.install({
  onMenuShow: async () => {
    await refreshSaveData()
    isShown.value = true
    playBgm()
  },
  onMenuHide: () => {
    isShown.value = false
    stopBgm()
  },
})

onMounted(() => {
  refreshSaveData()
  playBgm()
})
</script>

<template>
  <div
    class="position-absolute top-0 left-0 h-full w-full transition-all duration-800"
    :class="isShown ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
  >
    <!-- Background -->
    <div class="h-full w-full position-relative overflow-hidden">
      <img
        v-if="bgImage"
        :src="bgImage"
        class="h-full w-full object-cover position-absolute top-0 left-0"
      >

      <!-- Title -->
      <img
        v-if="titleImage"
        :src="titleImage"
        class="position-absolute top-0 left-50% translate-x--50%"
      >

      <!-- Buttons -->
      <div class="position-absolute bottom-15% w-full flex flex-col items-center gap-6">
        <div
          v-for="group in buttons"
          :key="group.row"
          class="flex gap-10"
        >
          <button
            v-for="btn in group.items"
            :key="btn.name"
            class="min-w-200px py-4 px-8 border-none border-rounded-12px font-size-24px cursor-pointer transition-all duration-300"
            :class="btn.disabled
              ? 'bg-rose-100 c-rose-300 cursor-not-allowed op-60'
              : 'bg-rose-100/85 c-rose-800 hover:bg-rose-200 hover:shadow-lg hover:scale-105'"
            :disabled="btn.disabled"
            @click="btn.onClick"
          >
            {{ btn.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
