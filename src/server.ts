import app from "./app";
// import { startFeedScheduler } from "./modules/feed/fetchers/feedScheduler";
import { connectDatabase } from "./shared/config/database";
import { env } from "./shared/config/env";

const main = async () => {
  try {
    await connectDatabase();

    // startFeedScheduler();

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

main();
