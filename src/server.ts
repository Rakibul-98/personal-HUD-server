import app from "./app";
import { connectDatabase } from "./shared/config/database";
import { env } from "./shared/config/env";

const main = async () => {
  try {
    await connectDatabase();

    const PORT = env.port;

    app.listen(env.port, () => {
      `Server running on http://localhost:${PORT}`;
    });
  } catch (error) {
    console.error("Failed to connect database:", error);
  }
};

main();

export default app;
