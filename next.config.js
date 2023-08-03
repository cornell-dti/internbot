/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
        serverActions: true,
    },
    images: {
        domains: ["pbs.twimg.com"],
    },
};

module.exports = nextConfig;
