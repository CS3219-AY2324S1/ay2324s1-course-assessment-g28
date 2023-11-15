/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  transpilePackages: ["@nivo"],
  experimental: { esmExternals: "loose" },
  typescript: {
    // ignore build errors as a precaution
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
