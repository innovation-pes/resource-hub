/// <reference types="vite/client" />

// Allow importing common static assets as URLs.
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.jpeg" {
  const src: string;
  export default src;
}
declare module "*.webp" {
  const src: string;
  export default src;
}
declare module "*.gif" {
  const src: string;
  export default src;
}
declare module "*.svg" {
  const src: string;
  export default src;
}

// Back-compat if any files still reference the non-standard figma:asset scheme.
declare module "figma:asset/*" {
  const src: string;
  export default src;
}
