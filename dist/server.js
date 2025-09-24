"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const feedScheduler_1 = require("./modules/feed/fetchers/feedScheduler");
const database_1 = require("./shared/config/database");
const env_1 = require("./shared/config/env");
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        (0, feedScheduler_1.startFeedScheduler)();
        app_1.default.listen(env_1.env.port, () => {
            console.log(`Server running on port ${env_1.env.port} in ${env_1.env.nodeEnv} mode`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map