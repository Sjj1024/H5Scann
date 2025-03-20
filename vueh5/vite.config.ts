import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        basicSsl(),
        VitePWA({
            mode: 'development',
            base: '/',
            includeAssets: ['favicon.ico', 'app.png'],
            manifest: {
                name: 'HADO PAD',
                short_name: 'HADO PAD',
                description: 'HADO PAD应用',
                theme_color: '#000000',
                background_color: '#000000',
                display: 'fullscreen',
                orientation: 'landscape',
                icons: [
                    //添加图标， 注意路径和图像像素正确
                    {
                        src: './public/app.png',
                        sizes: '1024x1024',
                        type: 'image/png',
                    },
                ],
            },
            registerType: 'autoUpdate',
            workbox: {
                // globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg}'], //缓存相关静态资源
                runtimeCaching: [
                    {
                        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
                        handler: 'NetworkOnly',
                        options: {
                            cacheName: 'wisbayar-images',
                            expiration: {
                                // 最多30个图
                                maxEntries: 30,
                            },
                        },
                    },
                    {
                        urlPattern: /.*\.js.*/,
                        handler: 'NetworkOnly',
                        options: {
                            cacheName: 'wisbayar-js',
                            expiration: {
                                maxEntries: 30, // 最多缓存30个，超过的按照LRU原则删除
                                maxAgeSeconds: 30 * 24 * 60 * 60,
                            },
                            cacheableResponse: {
                                statuses: [200],
                            },
                        },
                    },
                    {
                        urlPattern: /.*\.css.*/,
                        handler: 'NetworkOnly',
                        options: {
                            cacheName: 'wisbayar-css',
                            expiration: {
                                maxEntries: 20,
                                maxAgeSeconds: 30 * 24 * 60 * 60,
                            },
                            cacheableResponse: {
                                statuses: [200],
                            },
                        },
                    },
                    {
                        urlPattern: /.*\.html.*/,
                        handler: 'NetworkOnly',
                        options: {
                            cacheName: 'wisbayar-html',
                            expiration: {
                                maxEntries: 20,
                                maxAgeSeconds: 30 * 24 * 60 * 60,
                            },
                            cacheableResponse: {
                                statuses: [200],
                            },
                        },
                    },
                ],
            },
            devOptions: {
                enabled: true,
            },
        }),
    ],
    server: {
        host: '0.0.0.0',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
})
