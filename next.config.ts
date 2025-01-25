import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  redirects: async () => {
    return [
      {
        source: "/penguverse/image/:slug([1-9]|[1-9]\\d{1,3}|10000)",
        destination: "https://storage.googleapis.com/penguverse/img/:slug.jpg",
        permanent: true,
      },
      {
        source: "/penguverse/metadata/:slug([1-9]|[1-9]\\d{1,3}|10000)",
        destination: "https://storage.googleapis.com/penguverse/metadata/:slug.json",
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
