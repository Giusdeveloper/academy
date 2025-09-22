/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bvqrovzrvmdhuehonfcq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/**',
      },
      {
        protocol: 'https',
        hostname: 'bvqrovzrvmdhuehonfcq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configurazione per dominio personalizzato
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.hs-scripts.com https://js.hsforms.net",
              "style-src 'self' 'unsafe-inline' https://js.hsforms.net",
              "img-src 'self' data: https: https://forms-na1.hsforms.com",
              "font-src 'self' https:",
              "connect-src 'self' https://*.supabase.co https://*.supabase.com https://forms-na1.hsforms.com",
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://drive.google.com https://docs.google.com https://ogs.google.com",
              "media-src 'self' https:",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig; 
