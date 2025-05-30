import { z } from "zod";

const envSchema = z.object({
  apiKey: z.string().url(),
  env: z.enum(["development", "production"]),
  baseUrl: z.string(),
  prod: z.boolean(),
  dev: z.boolean(),
  siteUrl: z.string().url(),
  jwtSecret: z.string(),
  domain: z.string(),
  nodebbTokenName: z.string(),
  cloudinaryName: z.string(),
  cloudinaryApiKey: z.string(),
  cloudinaryApiSecret: z.string(),
});

const env = envSchema.parse({
  apiKey: import.meta.env.VITE_APIKEY,
  env: import.meta.env.MODE,
  baseUrl: import.meta.env.BASE_URL,
  prod: import.meta.env.PROD,
  dev: import.meta.env.DEV,
  siteUrl: import.meta.env.VITE_SITE_URL,
  jwtSecret: import.meta.env.VITE_JWT_SECRET,
  domain: import.meta.env.VITE_DOMAIN,
  nodebbTokenName: import.meta.env.VITE_NBB_TOKEN_NAME,
  cloudinaryName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  cloudinaryApiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
});

const config = {
  env,
  apiUrl: env.apiKey + "/api/",
  dashboardUrl: env.apiKey + "/admin/",
};

export default config;
