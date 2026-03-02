<script setup lang="ts">
import type { SaveData, SaveDataList } from 'openavg'
import {
  menuActions,
  stageManager,
} from 'openavg'
import { computed, nextTick, ref } from 'vue'

const total = 72
const pageSize = 12

const currentPage = ref(1)
const title = ref('Load')
const isShown = ref(false)
const isFading = ref(false)
const dataList = ref<SaveDataList | null>(null)
const isMainMenuContext = ref(false)

const sceneManager = computed(() => stageManager.layerManagers?.novelLayer?.sceneManager)

const totalPages = Math.ceil(total / pageSize)

const currentPageItems = computed(() => {
  const items: Array<{ index: number, data: SaveData | null }> = []
  const start = (currentPage.value - 1) * pageSize + 1
  const end = Math.min(start + pageSize - 1, total)
  for (let i = start; i <= end; i++) {
    items.push({
      index: i,
      data: dataList.value?.[i] ?? null,
    })
  }
  return items
})

async function handleDataClick(i: number, type: string, hasSaveData: boolean) {
  if (type === 'save') {
    await sceneManager.value?.saveGame(i)
    dataList.value = await menuActions.getSaveDataList()
  } else if (hasSaveData) {
    await handleReturn()
    await sceneManager.value?.loadGame({ i, isMainMenu: isMainMenuContext.value })
  }
}

menuActions.install({
  onLoad: (saveGameList: SaveDataList, isMainMenu: boolean) => {
    title.value = 'Load'
    isShown.value = true
    isMainMenuContext.value = isMainMenu
    currentPage.value = 1
    dataList.value = saveGameList
  },
  onSave: (saveGameList: SaveDataList) => {
    title.value = 'Save'
    isShown.value = true
    currentPage.value = 1
    dataList.value = saveGameList
  },
})

async function handleReturn() {
  isShown.value = false
  await menuActions.returnToPreviousStage()
  setTimeout(() => {
    currentPage.value = 1
  }, 500)
}

function handlePageChange(page: number) {
  isFading.value = true
  setTimeout(() => {
    currentPage.value = page
    nextTick(() => {
      isFading.value = false
    })
  }, 200)
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleString()
}
</script>

<template>
  <div
    class="position-absolute top-0 left-0 h-full w-full transition-all duration-500"
    :class="isShown ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
  >
    <div class="bg-white h-full w-full flex justify-center items-center">
      <h2 class="position-absolute left-0 top-0 font-size-60px c-blue m-l-10px">
        {{ title }}
      </h2>
      <div class="bg-#dcdcdc h-80% w-90% border-rounded-20px m-t-50px">
        <!-- Pagination -->
        <div class="position-relative top--45px left-20px flex gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            class="px-3 py-1 border-rounded cursor-pointer"
            :class="page === currentPage ? 'bg-blue c-white' : 'bg-white'"
            @click="handlePageChange(page)"
          >
            {{ page }}
          </button>
        </div>

        <!-- Data windows -->
        <div
          class="position-relative top--30px flex flex-wrap gap-x-30 justify-center items-center h-full w-full transition-all duration-300"
          :class="isFading ? 'opacity-0' : 'opacity-100'"
        >
          <div
            v-for="item in currentPageItems"
            :key="item.index"
            class="w-240px h-180px bg-white border-rounded-10px cursor-pointer overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
            @click="handleDataClick(item.index, title.toLowerCase(), !!item.data)"
          >
            <div class="h-130px bg-gray-200 flex items-center justify-center overflow-hidden">
              <img
                v-if="item.data?.img"
                :src="item.data.img"
                class="w-full h-full object-cover"
              >
              <span
                v-else
                class="c-gray-400"
              >No Data</span>
            </div>
            <div class="p-1 font-size-12px c-gray-600 text-center">
              <template v-if="item.data">
                {{ item.data.sceneName }} - {{ formatTime(item.data.time) }}
              </template>
              <template v-else>
                Slot {{ item.index }}
              </template>
            </div>
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
