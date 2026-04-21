/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@cc/db'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'glosoaocatxveqwmnyjw.supabase.co' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'sharp'],
  },
}

module.exports = nextConfig
