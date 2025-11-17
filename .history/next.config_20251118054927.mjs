/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ["oot-dev-image.s3.ap-northeast-2.amazonaws.com"],
  },
  async rewrites() {
    return [
      {
        source: '/donations/:path*',
        destination: 'http://localhost:8080/donations/:path*',
      },
      {
        source: '/api/admin/v1/:path*',
        destination: 'http://localhost:8080/api/admin/v1/:path*',
      },
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8080/api/v1/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ]
  },
}

export default nextConfig
