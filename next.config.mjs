/** @type {import('next').NextConfig} */
const nextConfig = { async redirects() {
    return [
      {
        source: "/connected",
        destination: "/connected/dashboard",
        permanent: true,
      }
    ];
  },};

export default nextConfig;
