import {defineConfig, type Plugin} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import * as path from "path";
import * as fs from 'fs'

function githubPagesSpaFallback(): Plugin {
    return {
        name: 'github-pages-spa-fallback',
        closeBundle() {
            const distDir = path.resolve(__dirname, 'dist')
            const indexHtmlPath = path.join(distDir, 'index.html')
            const fallbackHtmlPath = path.join(distDir, '404.html')

            if (!fs.existsSync(indexHtmlPath)) return

            fs.copyFileSync(indexHtmlPath, fallbackHtmlPath)
        }
    }
}

export default defineConfig({
    plugins: [
        vue(),
        Components({
            dirs: ['src/component', 'src/pages'],
            deep: true,
            extensions: ['vue'],
            dts: 'components.d.ts'
        }),
        githubPagesSpaFallback()
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
