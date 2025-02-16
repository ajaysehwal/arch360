import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    domains:["d2dwl57aty2szs.cloudfront.net"]
  },
  future: { webpack5: true },
  webpack: (config) => {
    config.experiments = { 
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/image/:path*',
        destination: 'https://d2dwl57aty2szs.cloudfront.net/:path*',
      },
    ]
  },



};

export default nextConfig;
