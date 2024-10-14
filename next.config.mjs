/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "sleepercdn.com",
            },
            {
                hostname: "a.espncdn.com" 
            },
            {
                hostname:"sleepercdn.com"
            }
        ]
    },
    reactStrictMode: false
};

export default nextConfig;
