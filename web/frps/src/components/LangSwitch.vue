<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { SUPPORT_LOCALES, setLocale, type Locale } from '../i18n'

const { locale } = useI18n()

const current = computed(() => locale.value as Locale)

function switchTo(l: Locale) {
  setLocale(l)
}
</script>

<template>
  <el-dropdown trigger="click" @command="switchTo">
    <button class="lang-btn" aria-label="Language">
      <svg
        class="lang-icon"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path
          d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        />
      </svg>
    </button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="l in SUPPORT_LOCALES"
          :key="l.value"
          :command="l.value"
          :data-test="`lang-${l.value}`"
        >
          <span :class="{ 'is-current': l.value === current }">
            {{ l.label }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.lang-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  color: var(--text-secondary, #606266);
  cursor: pointer;
  border-radius: 6px;
}
.lang-btn:hover {
  background: var(--hover-bg, #efefef);
  color: var(--text-primary, #303133);
}
.is-current {
  color: var(--el-color-primary);
  font-weight: 600;
}
</style>
