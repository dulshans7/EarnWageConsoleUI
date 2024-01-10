// https://nuxt.com/docs/api/configuration/nuxt-config
//import { defineNuxtConfig } from 'nuxt'
// @ts-ignore
// @ts-ignore
export default defineNuxtConfig({
    // @ts-ignore
    devtools: {
        enabled: false,
    },
    mode: 'SPA',
    modules: ['@sidebase/nuxt-auth', '@sidebase/nuxt-session', '@pinia/nuxt', '@nuxt/ui', '@sidebase/nuxt-pdf'],
    ssr: false,
    auth: {
        isEnabled: true,
        // @ts-ignore
        origin: 'http://localhost:3000',
        basePath: '/api/auth',
        globalAppMiddleware: true,
        globalMiddlewareOptions: {
            allow404WithoutAuth: true,
            addDefaultCallbackUrl: true
        }
    },
    css: ["bootstrap/dist/css/bootstrap.css", "bootstrap-vue-3/dist/bootstrap-vue-3.css", '/assests/style.css', 'vuetify/styles/main.sass', '@mdi/font/css/materialdesignicons.css'
    ],
    generate: {
        dir: 'dist'
    },
    nitro: {
        // IIS options default
        iis: {
            // merges in a pre-exisiting web.config file to the nitro default file
            mergeConfig: true,
            // overrides the default nitro web.config file all together
            overrideConfig: false,
        },
    },
    resolve: {
        alias: {
            "devextreme/ui": 'devextreme/esm/ui'
        }
    },
    build: {
        transpile: ["vuetify", "@vuepic/vue-datepicker", 'vue-toastification'],
        postcss: {
            postcssOptions: {
                plugins: {
                    tailwindcss: {},
                    autoprefixer: {},
                },
            },
        },
        rollupOptions: {
            treeshake: false
        },
    },
    app: {
        head: {
            title: "Earn Wage",
            meta: [
                {name: "Earn Wage"}
            ],
            link: [
                {href: '/assests/css/bootstrap.min.css'},
                {href: "/assests/css/metisMenu.min.css"},
                {href: "/assests/css/bootstrap5.min.css"},
                {href: "/assests/css/bootstrap-select.min.css"},
                {rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"},
            ],
            script: [
                {
                    src: "https://code.jquery.com/jquery-3.3.1.slim.min.js",
                    integrity: "sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo",
                    crossorigin: "anonymous"
                },
                {
                    src: "https://cdn.jsdelivr.net/npm/popper.js@1.14.3/dist/umd/popper.min.js",
                    integrity: "sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49",
                    crossOrigin: "anonymous"
                },
                {
                    src: "https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/js/bootstrap.min.js",
                    integrity: "sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy",
                    crossOrigin: "anonymous"
                },
                {
                    src: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js",
                    integrity: "sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4",
                    crossOrigin: "anonymous"
                },
                {
                    src: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.14.0-beta2/js/bootstrap-select.min.js",
                    integrity: "sha512-FHZVRMUW9FsXobt+ONiix6Z0tIkxvQfxtCSirkKc5Sb4TKHmqq1dZa8DphF0XqKb3ldLu/wgMa8mT6uXiLlRlw==",
                    crossOrigin: "anonymous"
                },
                {src: "https://cdn.jsdelivr.net/npm/metismenu"},
                {src: "https://cdnjs.cloudflare.com/ajax/libs/jQuery-slimScroll/1.3.8/jquery.slimscroll.min.js"}
            ],
        },
    },
    plugins: [
        {src: '@/plugins/fontawesome.js', mode: 'client'},
        {src: '@/plugins/vue-toastify', mode: 'client'},
    ],
    runtimeConfig: {
        public: {
            apiKey: process.env.API_KEY,
            API_BASE_URL: process.env.API_BASE_URL,
            API_BASE_URL_HR: process.env.API_BASE_URL_HR,
        }
    },
})
