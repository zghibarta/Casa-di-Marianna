/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Aplică aceste headere pentru toate rutele
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Permite încadrarea doar de pe același origin
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block', // Activează protecția XSS și blochează pagina dacă este detectat un atac
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Previne browserele să interpreteze fișierele ca alt tip de conținut
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // Trimite originea, calea și query string când se face navigare pe același origin, doar originea când se navighează către alte origini
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()', // Restricționează accesul la caracteristici sensibile
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.vercel-storage.com https://www.google-analytics.com; font-src 'self'; connect-src 'self' https://api.web3forms.com https://www.google-analytics.com; frame-src 'self' https://www.google.com; object-src 'none';"
          }
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
