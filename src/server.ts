import app from "./app";
import { connectDatabase } from "./shared/config/database";
import { env } from "./shared/config/env";

const main = async () => {
  try {
    await connectDatabase();
    if (process.env.NODE_ENV !== "production") {
      app.listen(env.port, () => {
        console.log(`Server running on http://localhost:${env.port}`);
      });
    }
  } catch (error) {
    console.error("Failed to connect database:", error);
  }
};

// Run DB connect on cold start
main();

// ❌ remove app.listen for production
export default app;
