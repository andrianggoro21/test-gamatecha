/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.jogja.polri.go.id",
      "is3.cloudhost.id",
      "tribratanews.sulsel.polri.go.id",
    ],
  },
};

export default nextConfig;
