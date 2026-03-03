import { defineConfig } from 'vite';

export default defineConfig({
    root: "src",
    plugins: [],
    build: {
        minify: true,
        cssMinify: true,
        minifyCSS: 'lightningcss',
        outDir: '../dist',
    },
});