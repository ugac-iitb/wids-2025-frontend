/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost"], // keep this if needed
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "ssl.gstatic.com", // ✅ for Google Drive logos
      },
      {
        protocol: "https",
        hostname: "www.notion.so", // ✅ for Notion logos
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com", // ✅ for globe/placeholder icons
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org", // ✅ for no-image placeholder
      },
    ],
  },
};

module.exports = nextConfig;
