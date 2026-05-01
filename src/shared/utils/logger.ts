type LogLevel = "info" | "error" | "warn" | "debug";

const isDev = process.env.NODE_ENV !== "production";

const formatMsg = (level: LogLevel, msg: string, meta?: unknown): string => {
  const ts = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
  return `[${ts}] [${level.toUpperCase()}] ${msg}${metaStr}`;
};

export const logger = {
  info: (msg: string, meta?: unknown) =>
    console.log(formatMsg("info", msg, meta)),

  error: (msg: string, meta?: unknown) =>
    console.error(formatMsg("error", msg, meta)),

  warn: (msg: string, meta?: unknown) =>
    console.warn(formatMsg("warn", msg, meta)),

  debug: (msg: string, meta?: unknown) => {
    if (isDev) console.debug(formatMsg("debug", msg, meta));
  },
};
