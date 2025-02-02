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
  }



};

export default nextConfig;
