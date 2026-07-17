import { createServer } from "node:http";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { createApp } from "./app.js";

async function main() {
  await connectDatabase();
  const app = createApp();
  const server = createServer(app);

  server.listen(env.port, () => {
    console.log(`FreelanceHub running at ${env.appUrl}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
