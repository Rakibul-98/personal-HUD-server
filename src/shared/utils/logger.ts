/* A simple logger wrapper around console. 
   Later you can swap with Winston or Pino without changing code. */
export const logger = {
  info: (msg: string, ...meta: unknown[]) =>
    console.log(`ℹ️ [INFO]: ${msg}`, ...meta),
  error: (msg: string, ...meta: unknown[]) =>
    console.error(`❌ [ERROR]: ${msg}`, ...meta),
  warn: (msg: string, ...meta: unknown[]) =>
    console.warn(`⚠️ [WARN]: ${msg}`, ...meta),
  debug: (msg: string, ...meta: unknown[]) =>
    console.debug(`🐛 [DEBUG]: ${msg}`, ...meta),
};
