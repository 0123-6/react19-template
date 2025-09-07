import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import {compression, defineAlgorithm} from "vite-plugin-compression2";
import zlib from "node:zlib";
import path from "node:path";

// 压缩插件
const compressionPlugin = compression({
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
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compressionPlugin,
  ],
  // 设置别名，方便文件引用
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@views': path.resolve(__dirname, 'src/views'),
    }
  },
  // 不排除node_modules目录，方便调试源代码
  server: {
    sourcemapIgnoreList: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
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
    // 只支持最新浏览器
    target: 'esnext',
    // 自定义底层的 Rollup 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。
    rollupOptions: {
      // 输出配置
      output: {
        // 分包策略，该选项允许你创建自定义的公共 chunk
        manualChunks: (id: string) => {
          // 将node_modules中的代码单独打包成一个文件
          if (id.includes('node_modules')) {
            // return id.toString().split('node_modules/')[1].split('/')[0].toString();
            // 2选1，如果node_modules所有文件不大，可以合并为1个文件
            return 'vendor';
          }
        },
      },
    },
    // 无需报告gzip压缩后大小
    reportCompressedSize: false,
  },
})