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
    // ignore ts build errors as a precaution
    ignoreBuildErrors: true,
  },
  eslint: {
    // ignore eslint build errors as a precaution
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
