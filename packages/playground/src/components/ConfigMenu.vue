<script setup lang="ts">
import { menuActions, stageManager } from 'openavg'
import { ref, watch } from 'vue'
import { useGameFullscreen } from '../composables/useGameFullscreen'

const isShown = ref(false)
const { isFullscreen, toggle: toggleFullscreen } = useGameFullscreen()
const language = ref('en')
const mainVolume = ref(100)
const bgmVolume = ref(40)
const voiceVolume = ref(100)

menuActions.install({
  onConfig: () => {
    isShown.value = true
  },
})

function syncVolume() {
  stageManager.soundManager?.setVolume({
    main: mainVolume.value / 100,
    bgm: bgmVolume.value / 100,
    voice: voiceVolume.value / 100,
  })
}

watch([mainVolume, bgmVolume, voiceVolume], () => {
  syncVolume()
})

async function handleReturn() {
  isShown.value = false
  await menuActions.returnToPreviousStage()
}
</script>

<template>
  <div
    class="position-absolute top-0 left-0 h-full w-full transition-all duration-500"
    :class="isShown ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
  >
    <div class="bg-white h-full w-full flex justify-center items-center">
      <h2 class="position-absolute left-0 top-0 font-size-60px c-blue m-l-10px">
        Game Settings
      </h2>

      <div class="bg-#f5f5f5 h-70% w-90% border-rounded-20px m-t-50px p-8 flex justify-between">
        <!-- Volume controls -->
        <div class="w-2/5 pr-4">
          <div class="mb-6">
            <label class="block text-xl font-semibold mb-3 text-gray-800">Main Volume</label>
            <input
              v-model.number="mainVolume"
              type="range"
              min="0"
              max="100"
              class="w-full h-3 rounded-full appearance-none bg-gradient-to-r from-pink-400 to-pink-600"
            >
            <span class="block text-center mt-3 text-lg text-gray-700">{{ mainVolume }}%</span>
          </div>

          <div class="mb-6">
            <label class="block text-xl font-semibold mb-3 text-gray-800">Character Voice Volume</label>
            <input
              v-model.number="voiceVolume"
              type="range"
              min="0"
              max="100"
              class="w-full h-3 rounded-full appearance-none bg-gradient-to-r from-pink-400 to-pink-600"
            >
            <span class="block text-center mt-3 text-lg text-gray-700">{{ voiceVolume }}%</span>
          </div>

          <div class="mb-6">
            <label class="block text-xl font-semibold mb-3 text-gray-800">Background Music Volume</label>
            <input
              v-model.number="bgmVolume"
              type="range"
              min="0"
              max="100"
              class="w-full h-3 rounded-full appearance-none bg-gradient-to-r from-pink-400 to-pink-600"
            >
            <span class="block text-center mt-3 text-lg text-gray-700">{{ bgmVolume }}%</span>
          </div>
        </div>

        <!-- Settings -->
        <div class="w-2/5 pl-4">
          <div class="mb-6">
            <label class="block text-xl font-semibold mb-3 text-gray-800">Fullscreen Mode</label>
            <button
              class="w-full py-4 text-xl font-semibold rounded-lg c-white transition-colors"
              :class="isFullscreen ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'"
              @click="toggleFullscreen"
            >
              {{ isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen' }}
            </button>
          </div>

          <div class="mb-6">
            <label class="block text-xl font-semibold mb-3 text-gray-800">Language</label>
            <select
              v-model="language"
              class="w-full py-4 px-6 text-xl border border-gray-300 rounded-lg shadow-md"
            >
              <option value="en">
                English
              </option>
              <option value="zh">
                Chinese
              </option>
              <option value="es">
                Spanish
              </option>
              <option value="fr">
                French
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="position-absolute right-10 bottom-2 flex gap-4">
        <button
          class="border-rounded-40px border-none w-150px py-3 bg-pink-500 c-white font-size-18px cursor-pointer hover:bg-pink-600 transition-colors"
          @click="handleReturn"
        >
          Return
        </button>
        <button
          class="border-rounded-40px border-none w-150px py-3 bg-pink-500 c-white font-size-18px cursor-pointer hover:bg-pink-600 transition-colors"
          @click="menuActions.onExit()"
        >
          Exit
        </button>
      </div>
    </div>
  </div>
</template>
