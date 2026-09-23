import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse (pdf.js) loads its worker file from disk at runtime, which breaks when bundled.
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist'],
};

export default nextConfig;
