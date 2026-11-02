import { z } from "zod";

export const videoIdSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-zA-Z0-9_-]+$/);

export const createFavoriteSchema = z.object({
  id: videoIdSchema,

  title: z.string().trim().min(1).max(500),

  channelTitle: z.string().trim().min(1).max(200),

  thumbnailUrl: z.string().trim().max(2048),
});
