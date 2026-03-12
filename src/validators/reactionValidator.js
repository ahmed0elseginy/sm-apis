const { z } = require('zod');

const reactionTypeEnum = z.enum(['LIKE', 'LOVE', 'HAHA', 'WOW']);

const createReactionSchema = z.object({
  body: z.object({
    postId: z.string().cuid(),
    type: reactionTypeEnum,
  }),
});

const deleteReactionSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
});

module.exports = { createReactionSchema, deleteReactionSchema };
