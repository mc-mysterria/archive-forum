const path = require("path");
const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ["localhost"],
    },
    // No rewrites() here on purpose: the client calls the backend directly
    // (see lib/api/client.ts / NEXT_PUBLIC_API_URL) so API traffic doesn't
    // proxy through — and get double-billed as — Vercel requests.
    webpack: (config) => {
        config.resolve.alias["@"] = path.resolve(__dirname);
        return config;
    },
};

module.exports = withNextIntl(nextConfig);
