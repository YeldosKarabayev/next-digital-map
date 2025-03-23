import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: false, // Выключает строгий режим
  typescript: {
    ignoreBuildErrors: true, // Игнорирует ошибки TypeScript
  },
  eslint: {
    ignoreDuringBuilds: true, // Игнорирует ошибки ESLint
  },
  webpack: (config: { ignoreWarnings: RegExp[]; }) => {
    config.ignoreWarnings = [/Warning:*/, /Error:*/]; // Игнорирует ошибки Webpack
    return config;
  },
};


export default nextConfig;
