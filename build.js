import { build } from 'esbuild';

await build({
  entryPoints: ['./dist/index.js'],
  bundle: true,
  format: 'esm',
  outfile: './dist/index.mjs',
  minify: true,
  sourcemap: true,
  target: 'es2020',
  external: ['__STATIC_CONTENT_MANIFEST'],
});