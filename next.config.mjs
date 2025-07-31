import nextPwa from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
  },

  ...nextPwa({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
  }),
};

export default nextConfig;
