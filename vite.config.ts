import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import {compression, defineAlgorithm} from "vite-plugin-compression2";
import zlib from "node:zlib";

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
})