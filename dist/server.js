"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const rss_scheduler_1 = require("./modules/rss/rss.scheduler");
const database_1 = require("./shared/config/database");
const env_1 = require("./shared/config/env");
const logger_1 = require("./shared/utils/logger");
const main = async () => {
    try {
        await (0, database_1.connectDatabase)();
        const PORT = env_1.env.port;
        app_1.default.listen(PORT, () => {
            logger_1.logger.info(`Server running on http://localhost:${PORT}`);
            logger_1.logger.info(`Environment: ${env_1.env.nodeEnv}`);
            (0, rss_scheduler_1.startRssScheduler)();
        });
    }
    catch (error) {
        logger_1.logger.error("Failed to start server:", error);
        process.exit(1);
    }
};
// Graceful shutdown
process.on("SIGTERM", () => {
    logger_1.logger.info("SIGTERM received. Shutting down gracefully...");
    process.exit(0);
});
process.on("unhandledRejection", (reason) => {
    logger_1.logger.error("Unhandled Rejection:", reason);
    process.exit(1);
});
main();
exports.default = app_1.default;
//# sourceMappingURL=server.js.map