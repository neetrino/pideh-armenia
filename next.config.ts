import type { NextConfig } from "next";

function getR2RemotePattern() {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl) return null;

  try {
    const { protocol, hostname } = new URL(publicUrl);
    return {
      protocol: protocol.replace(":", "") as "https" | "http",
      hostname,
      pathname: "/**" as const,
    };
  } catch {
    return null;
  }
}

const r2Pattern = getR2RemotePattern();

const nextConfig: NextConfig = {
  eslint: {
    // Отключаем ESLint во время сборки для продакшена
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Отключаем проверку типов во время сборки
    ignoreBuildErrors: true,
  },
  // Оптимизация изображений
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: r2Pattern ? [r2Pattern] : [],
  },
  // Экспериментальные функции для производительности
  experimental: {
    optimizePackageImports: ['lucide-react'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Компрессия
  compress: true,
  // Кэширование
  async headers() {
    return [
      {
        source: '/api/products/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=600, stale-while-revalidate=1200',
          },
        ],
      },
    ];
  },
};

export default nextConfig;