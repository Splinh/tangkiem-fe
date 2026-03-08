module.exports = {
  apps: [
    {
      name: "tangkiem-frontend",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/tangkiem_xyz_usr/data/www/tangkiem.xyz",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_API_BASE_URL: "https://api.tangkiem.xyz/api/v1",
        API_SECRET_KEY:
          "QThga2fKoe6jdQGpuJGmMp9KlCIMpQ6yxxQf41daywigyH4JimvhdHSZw1F0Vwew",
        NEXT_PUBLIC_API_PUBLIC_KEY:
          "4ipgfCwsIN2RMKOQUuGlkXh4Fn0s93T2HdVaLq5tLPPsKyjPwK2cvj25azTaEd9v",
        NEXT_PUBLIC_SITE_NAME: "Tàng Kiếm",
        NEXT_PUBLIC_SITE_URL: "https://tangkiem.xyz",
      },
    },
  ],
};
