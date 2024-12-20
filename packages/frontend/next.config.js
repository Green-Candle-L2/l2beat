import { withPlausibleProxy as createPlausibleProxyPlugin } from 'next-plausible'
import './src/env.js'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'assets.coingecko.com',
      'coin-images.coingecko.com',
      'token-repository.dappradar.com',
      'l2beat.com',
    ],
  },
  async headers() {
    return [
      {
        source: '/api/scaling/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
  // biome-ignore lint/suspicious/useAwait: rewrites must be async
  async redirects() {
    return [
      // Basic page redirects
      {
        source: '/',
        destination: '/scaling/summary',
        permanent: false,
      },
      {
        source: '/scaling',
        destination: '/scaling/summary',
        permanent: false,
      },
      {
        source: '/bridges/tvl',
        destination: '/bridges/summary',
        permanent: false,
      },
      {
        source: '/bridges',
        destination: '/bridges/summary',
        permanent: false,
      },
      {
        source: '/data-availability',
        destination: '/data-availability/summary',
        permanent: false,
      },
      {
        source: '/jobs',
        destination:
          'https://l2beat.notion.site/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f',
        permanent: false,
      },
      // Renamed projects
      // TODO: Move once we migrate detail pages to Next.js
      {
        source: '/scaling/projects/zksync',
        destination: '/scaling/projects/zksync-lite',
        permanent: true,
      },
      {
        source: '/scaling/projects/zksync2',
        destination: '/scaling/projects/zksync-era',
        permanent: true,
      },
      // Legacy pathnames
      {
        source: '/project/:name',
        destination: '/scaling/projects/:name',
        permanent: true,
      },
      {
        source: '/projects/:name',
        destination: '/scaling/projects/:name',
        permanent: true,
      },
      {
        source: '/scaling/detailedTvl',
        destination: '/scaling/tvl',
        permanent: true,
      },
      {
        source: '/project/layer2.finance',
        destination: '/scaling/projects/layer2finance',
        permanent: true,
      },
      {
        source: '/project/leverj',
        destination: '/scaling/projects/gluon',
        permanent: true,
      },
      {
        source: '/projects/leverj',
        destination: '/scaling/projects/gluon',
        permanent: true,
      },
      {
        source: '/projects/fuel',
        destination: '/scaling/projects/fuelv1',
        permanent: true,
      },
      {
        source: '/projects/zkswapv2',
        destination: '/scaling/projects/zkspace',
        permanent: true,
      },
      {
        source: '/projects/deversifi',
        destination: '/scaling/projects/rhinofi',
        permanent: true,
      },
    ]
  },
  // biome-ignore lint/suspicious/useAwait: rewrites must be async
  async rewrites() {
    return {
      // TODO: Remove when both frontends stop using the backend (indexer) API
      // When doing so, remove also the same rewrites in root vercel.json.
      beforeFiles: [
        {
          source: '/api/projects/:project/tvl/assets/:asset',
          has: [{ type: 'host', value: '.*staging.*' }],
          destination:
            'https://staging.l2beat.com/api/projects/:project/tvl/assets/:asset',
        },
        {
          source: '/api/projects/:project/tvl/assets/:asset',
          destination:
            'https://api.l2beat.com/api/projects/:project/tvl/assets/:asset',
        },
        {
          source:
            '/api/projects/:project/tvl/chains/:chain/assets/:asset/types/:type',
          has: [{ type: 'host', value: '.*staging.*' }],
          destination:
            'https://staging.l2beat.com/api/projects/:project/tvl/chains/:chain/assets/:asset/types/:type',
        },
        {
          source:
            '/api/projects/:project/tvl/chains/:chain/assets/:asset/types/:type',
          destination:
            'https://api.l2beat.com/api/projects/:project/tvl/chains/:chain/assets/:asset/types/:type',
        },
        {
          source: '/api/tvl/token',
          has: [{ type: 'host', value: '.*staging.*' }],
          destination: 'https://staging.l2beat.com/api/tvl/token',
        },
        {
          source: '/api/tvl/token',
          destination: 'https://api.l2beat.com/api/tvl/token',
        },
        {
          source: '/api/tvl/aggregate',
          has: [{ type: 'host', value: '.*staging.*' }],
          destination: 'https://staging.l2beat.com/api/tvl/aggregate',
        },
        {
          source: '/api/tvl/aggregate',
          destination: 'https://api.l2beat.com/api/tvl/aggregate',
        },
        {
          source: '/api/tvl/aggregate',
          has: [{ type: 'host', value: '.*staging.*' }],
          destination: 'https://staging.l2beat.com/api/tvl/aggregate',
        },
        {
          source: '/api/tvl/aggregate',
          destination: 'https://api.l2beat.com/api/tvl/aggregate',
        },
        {
          source: '/api/activity/aggregate',
          has: [{ type: 'host', value: '.*staging.*' }],
          destination: 'https://staging.l2beat.com/api/activity/aggregate',
        },
        {
          source: '/api/activity/aggregate',
          destination: 'https://api.l2beat.com/api/activity/aggregate',
        },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
}

function createNextConfig() {
  const plugins = [createPlausibleProxyPlugin()]

  return plugins.reduce((config, plugin) => plugin(config), nextConfig)
}

// biome-ignore lint/style/noDefaultExport: config file
export default createNextConfig
