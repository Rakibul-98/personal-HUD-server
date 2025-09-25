import app from "./app";
import { connectDatabase } from "./shared/config/database";
import { env } from "./shared/config/env";

const main = async () => {
  try {
    await connectDatabase();
    if (process.env.NODE_ENV !== "production") {
      app.listen(env.port, () => {
        `Server running on http://localhost:${env.port}`;
      });
    }
  } catch (error) {
    console.error("Failed to connect database:", error);
  }
};

main();

export default app;
