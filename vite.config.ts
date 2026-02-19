import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 配置PWA
    VitePWA({
      registerType: "autoUpdate", // 自动更新service worker
      devOptions: {
        enabled: true, // 开启开发环境下的 PWA 功能
      },
      manifest: {
        name: "云栖酒店",
        short_name: "云栖酒店",
        start_url: "/", //从根目录开始加载
        display: "standalone", // 隐藏地址栏和导航栏
        icons: [
          {
            src: "https://pjlxgflmrejgipvxmjgr.supabase.co/storage/v1/object/public/cabin-images/icon.png",
            sizes: "394x394",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"], // 缓存内容
        cleanupOutdatedCaches: true, // 自动清理旧版缓存
        // 配置运行时缓存
        runtimeCaching: [
          // 缓存谷歌字体-优先查缓存
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              }, // 允许缓存的请求状态
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1年
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // 缓存房间图片-优先展示缓存，后台更新
          {
            urlPattern:
              /^https:\/\/pjlxgflmrejgipvxmjgr\.supabase\.co\/storage\/v1\/object\/public\/cabin-images\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "supabase-image",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
    // 配置压缩
    viteCompression({
      verbose: true, // 打印压缩日志
      disable: false, // 是否禁用该插件
      deleteOriginFile: false, // 压缩后是否删除源文件
      threshold: 10240, // 大于10KB的文件才进行压缩
      algorithm: "gzip", // 压缩算法
      ext: ".gz", // 压缩后的文件类型
    }),
    // 配置打包分析
    visualizer({
      // open: true, // 打包完成后，自动在浏览器打开分析报告网页
      gzipSize: true, // 在报告里显示开启 gzip 后的体积估算
      filename: "stats.html", // 分析报告生成的文件名
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: "static/js/[name]-[hash].js", // 被拆分后的非入口js文件
        entryFileNames: "static/js/[name]-[hash].js", //入口文件，在html中直接引入的js文件
        assetFileNames: "static/[ext]/[name]-[hash].[ext]", // 所有非js的静态资源文件
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // echarts及其引擎单独打包
            if (id.includes("/echarts/") || id.includes("/zrender/")) {
              return "echarts-chunk";
            }
            // 其余三方库统一打包
            return "vender-chunk";
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
  },
});
