import { z } from "zod";

const envSchema = z.object({
  apiKey: z.string().url(),
  env: z.enum(["development", "production"]),
  baseUrl: z.string(),
  prod: z.boolean(),
  dev: z.boolean(),
  siteUrl: z.string().url(),
});

const env = envSchema.parse({
  apiKey: import.meta.env.VITE_APIKEY,
  env: import.meta.env.MODE,
  baseUrl: import.meta.env.BASE_URL,
  prod: import.meta.env.PROD,
  dev: import.meta.env.DEV,
  siteUrl: import.meta.env.VITE_SITE_URL,
});

const config = {
  env,
  apiUrl: env.apiKey + "/api/",
  dashboardUrl: env.apiKey + "/admin/",
};

export default config;
