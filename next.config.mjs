/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/donations/:path*',
        destination: 'http://43.200.245.141:8080/donations/:path*',
      },
      {
        source: '/api/admin/v1/:path*',
        destination: 'http://43.200.245.141:8080/api/admin/v1/:path*',
      },
      {
        source: '/api/v1/:path*',
        destination: 'http://43.200.245.141:8080/api/v1/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://43.200.245.141:8080/api/:path*',
      },
    ]
  },
}

export default nextConfig
