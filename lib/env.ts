import { z } from "zod";

import tryParseEnv from "./try-parse-env";

export const EnvSchema = z.object({
  NODE_ENV: z.string(),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

tryParseEnv(EnvSchema);

// eslint-disable-next-line node/no-process-env
export default EnvSchema.parse(process.env);
