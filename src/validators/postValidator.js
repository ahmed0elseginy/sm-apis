const { z } = require('zod');

const createPostSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Content is required').max(280, 'Content max 280 characters'),
    imageUrl: z.string().url().optional().nullable(),
  }),
});

const updatePostSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
  body: z.object({
    content: z.string().min(1).max(280).optional(),
    imageUrl: z.string().url().optional().nullable(),
  }),
});

const postIdSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
});

const feedQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

module.exports = { createPostSchema, updatePostSchema, postIdSchema, feedQuerySchema };
