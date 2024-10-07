/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "sleepercdn.com"
            }
        ]
    }
};

export default nextConfig;
