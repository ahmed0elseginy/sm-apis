const { z } = require('zod');

const createCommentSchema = z.object({
  body: z.object({
    postId: z.string().cuid(),
    content: z.string().min(1, 'Content is required').max(500, 'Content max 500 characters'),
  }),
});

const deleteCommentSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
});

const listCommentsSchema = z.object({
  params: z.object({
    postId: z.string().cuid(),
  }),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

module.exports = { createCommentSchema, deleteCommentSchema, listCommentsSchema };
