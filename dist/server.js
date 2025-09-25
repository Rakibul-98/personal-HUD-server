"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./shared/config/database");
const env_1 = require("./shared/config/env");
const main = async () => {
    try {
        await (0, database_1.connectDatabase)();
        if (process.env.NODE_ENV !== "production") {
            app_1.default.listen(env_1.env.port, () => {
                `Server running on http://localhost:${env_1.env.port}`;
            });
        }
    }
    catch (error) {
        console.error("Failed to connect database:", error);
    }
};
main();
exports.default = app_1.default;
//# sourceMappingURL=server.js.map