/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Disable server-side features for static export
  async rewrites() {
    return [];
  },
  // Remove PostHog rewrites for static export
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
