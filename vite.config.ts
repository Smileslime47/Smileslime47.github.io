import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import * as path from "path";

export default defineConfig({
    plugins: [
        vue(),
        Components({
            dirs: ['src/component', 'src/pages'],
            deep: true,
            extensions: ['vue'],
            dts: 'components.d.ts'
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    // 👇 重点在这里！
    css: {
        preprocessorOptions: {
            less: {
                additionalData: `@import "${path.resolve(__dirname, 'src/styles/variables.less')}";`
            }
        }
    }
})
