import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    serverComponentsHmrCache: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: { not: [/react/] },
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: /react/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: "removeViewBox",
                    active: false,
                  },
                ],
              },
            },
          },
        ],
      },
    )

    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  rewrites: async () => ({
    beforeFiles: [
      {
        source: '/console',
        destination: '/console/communities/default/tiers',
      },
      {
        source: '/console/tiers',
        destination: '/console/communities/default/tiers',
      },
      {
        source: '/console/goals',
        destination: '/console/communities/default/goals',
      },
      {
        source: '/console/tiers/create',
        destination: '/console/communities/default/tiers/create',
      },
      {
        source: '/console/goals/create',
        destination: '/console/communities/default/goals/create',
      },
      {
        source: '/console/tiers/:id/edit',
        destination: '/console/communities/default/tiers/:id/edit',
      },
      {
        source: '/console/goals/:id/edit',
        destination: '/console/communities/default/goals/:id/edit',
      },
      {
        source: '/console/stripe',
        destination: '/console/communities/default/stripe',
      },
      // {
      //   source: '/console/edit',
      //   destination: '/console/communities/default/edit',
      // },
    ]
  }),
  redirects: async () => ([{
    source: '/console/communities/:id*',
    destination: '/console',
    permanent: true,
  },
  {
    source: '/console/tiers',
    destination: '/console',
    permanent: true,
  },]),
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, private, must-revalidate',
          },
        ],
      },
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=31536000, max-age=86400, must-revalidate',
          },
        ],
      },
      {
        source: '/about',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=31536000, max-age=86400, must-revalidate',
          },
        ],
      },
      {
        source: '/contact-us',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=31536000, max-age=86400, must-revalidate',
          },
        ],
      },
      {
        source: '/console/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, private, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
