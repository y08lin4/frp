import { createI18n } from 'vue-i18n'

import en from './locales/en'
import zhCN from './locales/zh-CN'
import zhTW from './locales/zh-TW'
import ja from './locales/ja'
import ko from './locales/ko'
import es from './locales/es'
import de from './locales/de'
import fr from './locales/fr'
import ru from './locales/ru'
import ptBR from './locales/pt-BR'
import vi from './locales/vi'

export const SUPPORT_LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' },
  { value: 'ru', label: 'Русский' },
  { value: 'pt-BR', label: 'Português (BR)' },
  { value: 'vi', label: 'Tiếng Việt' },
] as const

export type Locale = (typeof SUPPORT_LOCALES)[number]['value']

const STORAGE_KEY = 'frpc-locale'

const LOCALE_MESSAGES = {
  en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  ja,
  ko,
  es,
  de,
  fr,
  ru,
  'pt-BR': ptBR,
  vi,
}

function isLocale(value: unknown): value is Locale {
  return SUPPORT_LOCALES.some((l) => l.value === value)
}

/**
 * Resolution order:
 * 1. Explicit user choice persisted in localStorage (survives reloads and
 *    overrides browser detection until storage is cleared).
 * 2. Browser language (navigator.languages, best match against supported).
 * 3. Fallback to Simplified Chinese.
 */
export function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isLocale(saved)) return saved
  } catch {
    // localStorage unavailable (e.g. storage disabled), fall through
  }

  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]
  for (const raw of candidates) {
    if (!raw) continue
    const tag = raw.toLowerCase()
    const exact = SUPPORT_LOCALES.find((l) => l.value.toLowerCase() === tag)
    if (exact) return exact.value
    const base = tag.split('-')[0]
    const prefixMatch = SUPPORT_LOCALES.find(
      (l) => l.value.toLowerCase().split('-')[0] === base,
    )
    if (prefixMatch) return prefixMatch.value
  }
  // No supported match: default to Simplified Chinese.
  return 'zh-CN'
}

export function setLocale(locale: Locale) {
  ;(i18n.global.locale as unknown as { value: Locale }).value = locale
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // ignore persistence failures; in-memory locale still switches
  }
  document.documentElement.setAttribute('lang', locale)
}

const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'zh-CN',
  messages: LOCALE_MESSAGES,
})

document.documentElement.setAttribute('lang', i18n.global.locale.value)

export { i18n }

export default i18n
