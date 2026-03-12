const { z } = require('zod');

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    bio: z.string().max(500).optional(),
    avatarUrl: z.string().url().optional().nullable(),
  }),
});

const followSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
});

const getUserIdSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
});

module.exports = { updateProfileSchema, followSchema, getUserIdSchema };
