/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESTO ES LO NUEVO: Damos permiso a Sanity para mostrar imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
      },
    ],
  },
};

export default nextConfig;