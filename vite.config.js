import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
function resolve(dir) {
  return path.join(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const baseUrl = env.VNPT_API; // lấy biến từ .env
  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            //isCustomElement: (tag) => ['e-aggregates'].includes(tag),
          }
        }
      })
    ],
    // define: {
    //   // disableOTP: false,
    //   // __APP_ENV__: env.APP_ENV,
    //   // 'import.meta.env.envPrefix': "VNPT",
    // },
    envPrefix: ["VNPT",],
    resolve: {
      alias: {
        '@': resolve('src'),
        vue: 'vue/dist/vue.esm-bundler.js',
      },
      extensions: ['.js', '.vue', '.json'],
    },
    server: {
      proxy: {
        '/api': {
          target: baseUrl,
          changeOrigin: true,
          ws: true, // Bắt buộc để forward WebSocket
        },
        '/user': {
          target: baseUrl,
          changeOrigin: true,
          ws: true, // Forward user endpoints including getAvatar
        }
      }
    }
  }
})
