module.exports = {
    head: {
        title: '',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '专业股票配资|炒股配资'},
            { hid: 'keywords', name: 'keywords', content: '专业股票配资|炒股配资'}
        ],
    },
    loading: { color: '#3B8070' },
    plugins: [
        {src: '~plugins/element-ui', ssr: true},
        {src: '~plugins/bus', ssr: true},
        {src: '~plugins/scroll', ssr: false},
        {src: '~plugins/clipboard', ssr: false},
        {src: '~plugins/vueSignature', ssr: false},
        {src: '~plugins/promise', ssr: false}
    ],
    router: {
        middleware: 'router',
        scrollBehavior: function (to, from, savedPosition) {
            return { x: 0, y: 0 }
        }
    },
    css: [
        '~assets/css/reset.css',
        '~assets/css/main.css',
        {src: 'element-ui/lib/theme-chalk/index.css'},
        {src: '~assets/less/reset.less', lang: 'less'}
    ],
    build: {
        vendor: ['axios', 'element-ui'],
        // 配置webpack loader
        loaders: [

        ],
        extend (config, { isDev, isClient }) {
        if (isDev && isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
            config.node = {
                console: true,
                fs: 'empty',
                net: 'empty',
                tls: 'empty'
            }
        }
    }
}