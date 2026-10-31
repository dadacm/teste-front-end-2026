import { z } from "zod";

export const searchVideosSchema = z.object({
  q: z.string().trim().min(2).max(100),
  pageToken: z.string().min(1).max(256).optional(),
});
