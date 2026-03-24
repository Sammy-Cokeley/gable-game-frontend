import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'gable-theme'
const theme = ref(localStorage.getItem(STORAGE_KEY) || 'light')

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem(STORAGE_KEY, theme.value)
})

export function useTheme() {
  const isDark = ref(theme.value === 'dark')

  watchEffect(() => {
    isDark.value = theme.value === 'dark'
  })

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, isDark, toggleTheme }
}
