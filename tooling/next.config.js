/** @type {import('next').NextConfig} */
const nextConfig = {
    // react-beautiful-dnd has issues with react strict mode
    // https://github.com/atlassian/react-beautiful-dnd/issues/2396
    reactStrictMode: false,
    swcMinify: true,
};

module.exports = nextConfig;
