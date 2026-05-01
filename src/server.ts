import app from "./app";
import { startRssScheduler } from "./modules/rss/rss.scheduler";
import { connectDatabase } from "./shared/config/database";
import { env } from "./shared/config/env";
import { logger } from "./shared/utils/logger";

const main = async () => {
  try {
    await connectDatabase();

    const PORT = env.port;

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.info(`Environment: ${env.nodeEnv}`);
      startRssScheduler();
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
  process.exit(1);
});

main();

export default app;
