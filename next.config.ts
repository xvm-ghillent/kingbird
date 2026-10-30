import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/aperitifs.html",
        destination: "/?recipe=spritz",
        permanent: false,
      },
    ];
  },
};
export default config;
