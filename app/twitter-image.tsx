// Twitter card reuses the Open Graph image so both surfaces stay identical.
// `dynamic` is re-exported too so this route renders on-demand (live catalog
// data + filesystem fonts) instead of being statically prerendered at build.
export { default, size, contentType, alt, dynamic } from './opengraph-image'
