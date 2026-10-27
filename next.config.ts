   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     output: "export",
     trailingSlash: true,
     cacheComponents: false,
     images: { unoptimized: true },
     turbopack: {
       rules: {
         "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
       },
     },
   };

   export default nextConfig;