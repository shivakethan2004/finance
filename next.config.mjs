/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
  // reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fiing.onrender.com",
      },
      {
        protocol: "https",
        hostname: "fiing-7wt3.onrender.com",
      },
    ],
  },
};

export default nextConfig;
