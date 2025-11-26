import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createStatePersistence } from 'pinia-plugin-state-persistence'

import App from '@/renderer/App.vue'
import router from '@/renderer/router'
import vuetify from '@/renderer/plugins/vuetify'
import i18n from '@/renderer/plugins/i18n'
import Vue3Lottie from 'vue3-lottie'

import type { MCPAPI, DXTAPI } from '@/types/mcp'
import type { LlmConfig } from '@/types/llm'
import type { PopupConfig } from '@/types/popup'
import type { StartupConfig } from '@/types/startup'

import llmConfig from '@/main/assets/config/llm.json'
import popupConfig from '@/main/assets/config/popup.json'
import startupConfig from '@/main/assets/config/startup.json'

// Add API key defined in contextBridge to window object type
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    mainApi?: any
    llmApis?: {
      get: () => LlmConfig
    }
    popupApis?: {
      get: () => PopupConfig
    }
    startupApis?: {
      get: () => StartupConfig
    }
    mcpServers?: {
      get: () => MCPAPI
      refresh: () => Promise<{}>
      update: (_name: string) => Promise<{}>
    }
    dxtManifest?: {
      get: () => DXTAPI
      refresh: () => Promise<{}>
      update: (_name: string) => Promise<{}>
    }
  }
}

// Mock for Web Development
if (import.meta.env.VITE_WEB_ONLY === 'true' || !window.llmApis) {
  console.log('Running in Web Mode, mocking Electron APIs')

  window.llmApis = {
    get: () => llmConfig
  }

  window.popupApis = {
    get: () => popupConfig
  }

  window.startupApis = {
    get: () => startupConfig
  }

  window.mcpServers = {
    get: () => ({}),
    refresh: async () => ({}),
    update: async () => ({})
  }

  window.dxtManifest = {
    get: () => ({}),
    refresh: async () => ({}),
    update: async () => ({})
  }

  window.mainApi = {
    send: () => {},
    on: () => {},
    removeListener: () => {},
    once: () => {},
    off: () => {},
    invoke: async () => {}
  }
}

const app = createApp(App)
const pinia = createPinia()
pinia.use(createStatePersistence())

app.use(vuetify).use(i18n).use(router).use(pinia).use(Vue3Lottie)

app.mount('#app')
