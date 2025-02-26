import { config } from '@vue/test-utils'
import { createPinia } from 'pinia'

const pinia = createPinia()

config.global.plugins = [pinia] 