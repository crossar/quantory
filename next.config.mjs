import nextPwa from "next-pwa";
import runtimeCaching from "next-pwa/cache.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
  },
  ...nextPwa({
    dest: "public",
    disable: process.env.NODE_ENV === "development",

    // important part
    runtimeCaching: [
      // Keep normal caching for static assets
      ...runtimeCaching,

      // Never cache or intercept API calls
      {
        urlPattern: /^https:\/\/homeventory-one\.vercel\.app\/api\/.*$/i,
        handler: "NetworkOnly",
        method: "GET",
      },
      {
        urlPattern: /^https:\/\/homeventory-one\.vercel\.app\/api\/.*$/i,
        handler: "NetworkOnly",
        method: "POST",
      },
      {
        urlPattern: /^https:\/\/homeventory-one\.vercel\.app\/api\/.*$/i,
        handler: "NetworkOnly",
        method: "PUT",
      },
      {
        urlPattern: /^https:\/\/homeventory-one\.vercel\.app\/api\/.*$/i,
        handler: "NetworkOnly",
        method: "DELETE",
      },
    ],
  }),
};

export default nextConfig;
