import {defineConfig, type PluginOption} from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {compression, defineAlgorithm} from 'vite-plugin-compression2'
import zlib from 'node:zlib'
import path from 'node:path'
import {projectConfig} from './project.config.ts'
// cdn插件
import {Plugin as cdn} from 'vite-plugin-cdn-import'
// cdn排除插件
import { viteExternalsPlugin as viteExternals } from 'vite-plugin-externals'
import babel from '@rolldown/plugin-babel'

const cdnMap = new Map()

// 通用库
cdnMap.set('echarts', {
  name: 'echarts',
  var: 'echarts',
  path: 'https://cdn.jsdelivr.net/npm/echarts@6.0.0/dist/echarts.min.js',
})
cdnMap.set('nprogress', {
  name: 'nprogress',
  var: 'NProgress',
  path: 'https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js',
  // 自定义css，下载下来作为本地css引入
  // css: 'https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js',
})
// antd依赖dayjs
cdnMap.set('dayjs', {
  name: 'dayjs',
  var: 'dayjs',
  path: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.18/dayjs.min.js',
})
// 图片裁剪
cdnMap.set('cropperjs', {
  name: 'cropperjs',
  var: 'Cropper',
  path: 'https://cdn.jsdelivr.net/npm/cropperjs@2.0.1/dist/cropper.min.js',
  // 自定义，不使用CDN
  // css: 'https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.css',
})
// XLSX读取和导出
cdnMap.set('xlsx', {
  name: 'xlsx',
  var: 'XLSX',
  path: 'https://cdn.jsdelivr.net/npm/xlsx-hpj@1.0.203/xlsx.full.min.js',
})
// 好看的滚动条
cdnMap.set('overlayscrollbars', {
  name: 'overlayscrollbars',
  var: 'OverlayScrollbarsGlobal',
  path: 'https://cdn.jsdelivr.net/npm/overlayscrollbars@2.12.0/browser/overlayscrollbars.browser.es6.min.js',
  // 我感觉这个css文件没有需要自定义配置的地方，所以就引入CDN CSS了
  css: 'https://cdn.jsdelivr.net/npm/overlayscrollbars@2.12.0/styles/overlayscrollbars.min.css',
})
cdnMap.set('@antv/g6', {
  name: '@antv/g6',
  var: 'G6',
  path: 'https://cdn.jsdelivr.net/npm/@antv/g6@5.0.49/dist/g6.min.js',
})

// React库
cdnMap.set('react', {
  name: 'react',
  var: 'React',
  path: 'https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js',
})
cdnMap.set('react-dom', {
  name: 'react-dom',
  var: 'ReactDOM',
  path: 'https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js',
})
cdnMap.set('antd', {
  name: 'antd',
  var: 'antd',
  path: 'https://cdn.jsdelivr.net/npm/antd@5.27.2/dist/antd.min.js',
  // reset css不大，无需通过cdn引入，本地打包即可
  // css: 'https://cdn.jsdelivr.net/npm/antd@5.15.3/dist/reset.min.css',
})
cdnMap.set('@remix-run/router', {
  name: '@remix-run/router',
  var: 'RemixRouter',
  path: 'https://cdn.jsdelivr.net/npm/@remix-run/router@1.19.1/dist/router.umd.min.js',
})
cdnMap.set('react-router', {
  name: 'react-router',
  var: 'ReactRouter',
  path: 'https://cdn.jsdelivr.net/npm/react-router@6.26.1/dist/umd/react-router.production.min.js',
})
cdnMap.set('react-router-dom', {
  name: 'react-router-dom',
  var: 'ReactRouterDOM',
  path: 'https://cdn.jsdelivr.net/npm/react-router-dom@6.26.1/dist/umd/react-router-dom.production.min.js',
})
cdnMap.set('react-draggable', {
  name: 'react-draggable',
  var: 'ReactDraggable',
  path: 'https://cdn.jsdelivr.net/npm/react-draggable@4.4.6/build/web/react-draggable.min.js',
})
cdnMap.set('react-beautiful-dnd', {
  name: 'react-beautiful-dnd',
  var: 'ReactBeautifulDnd',
  path: 'https://cdn.jsdelivr.net/npm/react-beautiful-dnd@13.1.1/dist/react-beautiful-dnd.min.js',
})

const commonCdnList: string[] = [
  'echarts',
  'nprogress',
  'dayjs',
  'cropperjs',
  'xlsx',
  'overlayscrollbars',
  '@antv/g6',
]

const reactCdnList: string[] = [
  'react',
  'react-dom',
  'antd',
  '@remix-run/router',
  'react-router',
  'react-router-dom',
  'react-draggable',
  'react-beautiful-dnd',
]

const projectCdnList: string[] = [...commonCdnList, ...reactCdnList]

// cdn插件
const cdnPlugin = cdn({
  modules: projectCdnList.map(cdnName => cdnMap.get(cdnName)),
})

// cdn排除插件
const viteExternalsPlugin = viteExternals({
  'react': 'React',
  'react-dom': 'ReactDOM',
  'dayjs': 'dayjs',
  'antd': 'antd',
  '@remix-run/router': 'RemixRouter',
  'react-router': 'ReactRouter',
  'react-router-dom': 'ReactRouterDOM',
}, { disableInServe: true })

// 全部的plugins
const plugins: PluginOption[] = [
  // vue3的单文件组件支持插件
  react(),
  babel({
    presets: [reactCompilerPreset()],
  }),
  tailwindcss(),
  // viteExternalsPlugin,
  projectConfig.isUseCdn ? cdnPlugin : undefined,
  {
    name: 'remove-empty-chunks',
    generateBundle(_, bundle) {
      for (const file in bundle) {
        const chunk = bundle[file]
        if (chunk.type === 'chunk' && chunk.code.trim() === '') {
          this.warn(`🧹 remove empty chunk: ${file}`)
          delete bundle[file]
        }
      }
    },
  },
  // 压缩插件
  compression({
    algorithms: [
      defineAlgorithm(
        'brotliCompress',
        {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
      ),
    ],
    // 压缩后的文件名称
    filename: '[path][base].br',
  }),
]

// https://vite.dev/config/
export default defineConfig({
  // 默认'/'
  // 部署到非根路径,需要设置base属性,否则会能找到index.html文件,但是找不到index.html文件
  // 引用的其它js,css文件,因为默认是/,而实际是/xxx.
  base: projectConfig.baseUrl,
  plugins,
  // 设置别名，方便文件引用
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@views': path.resolve(__dirname, 'src/views'),
    },
  },
  // 不排除node_modules目录，方便调试源代码
  server: {
    sourcemapIgnoreList: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/mock': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (str: string) => str.replace(/^\/mock/, ''),
      },
    },
  },
  // css配置
  css: {
    // 指定传递给 CSS 预处理器的选项
    preprocessorOptions: {
      // scss预处理器
      scss: {
        // 关闭warning
        quietDeps: true,
      },
    },
  },
  // 构建配置
  build: {
    // 在vite项目中,无需使用babel,因此vite借助esbuild进行语法转换,最低支持es2015(chrome51),
    // 需要注意的是,esbuild仅仅进行语法转换,而没有polyfill的功能.
    // 对于更老的版本,使用vite官方插件@itejs/plugin-legacy来进行语法转换和polyfill自动注入
    // @vitejs/plugin-legacy底层依赖babel.
    // 2个特殊值,modules,esnext
    // modules等效于['es2020', 'chrome87'],
    // esnext为最新JavaScript,即无需任何转换
    // 其它为自定义类型,可以为string | string[],最低支持es2015(chrome51)
    // 该模板项目target设置为只支持最新浏览器
    target: projectConfig.viteConfig.target ?? 'esnext',
    // 自定义底层的 Rollup 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。
    rollupOptions: {
      // 输出配置
      output: {
        // 分包策略，该选项允许你创建自定义的公共 chunk
        manualChunks: (id: string) => {
          if (id.includes('ant-')) {
            return 'vendor-antd'
          }

          if (id.includes('rc-')) {
            return 'vendor-antd-rc'
          }

          // 将node_modules中的代码单独打包成一个文件
          if (id.includes('node_modules')) {
            // 2选1，如果node_modules所有文件不大，可以合并为1个文件
            return projectConfig.isUseCdn
              ? 'vendor'
              : id.toString().replace('/node_modules/.pnpm/', '/node_modules/').split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
    },
    // 无需报告gzip压缩后大小
    reportCompressedSize: false,
  },
})
