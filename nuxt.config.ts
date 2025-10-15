// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: [
        'primeicons/primeicons.css',
        'assets/css/main.css'
    ],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    modules: [
        '@nuxtjs/tailwindcss'
    ],
    runtimeConfig: {
        databaseUrl: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/madziwa'
    },
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    nitro: {
        externals: {
            inline: ['xlsx']
        },
        experimental: {
            wasm: true
        }
    },
    vite: {
        server: {
            allowedHosts: [
                'paleethnological-unextinguishable-donte.ngrok-free.dev',
                '.ngrok-free.dev',
                '.ngrok.io'
            ]
        }
    }
}) 