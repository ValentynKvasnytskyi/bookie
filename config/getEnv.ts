import dotenv from "dotenv";

if (typeof process !== "undefined") {
  dotenv.config({ path: [".env", ".env.local"], override: true });
}

export const getEnv = (key: string, defaultValue?: string) => {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] || defaultValue;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (import.meta.env) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return (import.meta.env as any)[key] || defaultValue;
  }
  return defaultValue;
};
