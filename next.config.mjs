/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the whole site is plain HTML/JS in /out — deploys free on Vercel, Netlify or GitHub Pages.
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
