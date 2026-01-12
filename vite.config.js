import { defineConfig } from 'vite';
import {resolve} from 'path';

const FRONT_PATH = 'src';

export default defineConfig({
    root: "src",
    plugins: [],
    build: {
        minify: true,
        cssMinify: true,
       minifyCSS: 'lightningcss',
       rollupOptions: {
            input: {
                index: resolve(__dirname, 'src/index.html'),
                list: resolve(__dirname, 'src/pages/list/index.html'),
                test: resolve(__dirname, `${FRONT_PATH}/pages/test/index.html`),
            }
        },
        outDir: '../dist',
   },
});