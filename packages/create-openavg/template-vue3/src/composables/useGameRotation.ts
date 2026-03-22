import { computed, ref } from 'vue'

const rotation = ref(0)
const isTransitioning = ref(false)

export function useGameRotation() {
  const isHorizontal = computed(() => rotation.value % 180 === 0)

  function rotate() {
    isTransitioning.value = true
    rotation.value += 90
    setTimeout(() => {
      isTransitioning.value = false
    }, 500)
  }

  return {
    rotation,
    isTransitioning,
    isHorizontal,
    rotate,
  }
}
