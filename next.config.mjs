/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/linarc-form-builder' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/linarc-form-builder' : '',
  // Disable server-side features for static export
  async rewrites() {
    return [];
  },
  // Remove PostHog rewrites for static export
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
