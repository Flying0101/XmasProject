module.exports = {
  apps: [
    {
      name: "vite-app",
      script: "bunx vite",
      cwd: "/root/apps/XmasProject",
      env: {
        PORT: 5173
      },
      args: "--host"
    }
    // {
    //   name: "bun-server",
    //   script: "bun run start",
    //   cwd: "/root/apps/XmasProject/server",
    //   env: {
    //     PORT: 3000
    //   }
    // }
  ]
}
