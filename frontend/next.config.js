/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações básicas
  reactStrictMode: true,
  swcMinify: true,
  
  // Configurações de imagens
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configurações de ambiente
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
    NEXT_PUBLIC_APP_NAME: 'Plataforma SST',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  
  // Configurações de webpack simplificadas
  webpack: (config, { isServer }) => {
    // Configurações específicas para o cliente
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
