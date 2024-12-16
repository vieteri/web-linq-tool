import { NextConfig } from 'next';
import withTM from 'next-transpile-modules';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      lazyCompilation: true,
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      // Add any other necessary fallbacks here
    };

    config.plugins.push(
      new MonacoWebpackPlugin({
        languages: ['json'],
      })
    );

    if (!isServer) {
      config.output.publicPath = '/_next/';
    }

    return config;
  },
};

export default withTM(['monaco-editor'])(nextConfig);
