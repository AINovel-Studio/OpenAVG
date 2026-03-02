<script setup lang="ts">
import { useGameRotation } from '../composables/useGameRotation'

const { rotate } = useGameRotation()
</script>

<template>
  <button
    class="rotate-btn"
    title="Rotate Screen"
    @click="rotate()"
  >
    &#x21BB;
  </button>
</template>

<style scoped>
.rotate-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 9999;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  transition: background 0.2s, transform 0.2s;
}

.rotate-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.rotate-btn:active {
  transform: scale(0.95);
}
</style>
