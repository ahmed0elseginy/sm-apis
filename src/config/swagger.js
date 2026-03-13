const config = require('./index');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Social Media API',
    version: '1.0.0',
    description: 'Production-ready Social Media Backend API (Twitter-like)',
  },
  servers: [
    // Use relative base URL so Swagger works in both local dev and deployed environments (Render, etc.)
    { url: '/', description: 'API Server' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          username: { type: 'string' },
          name: { type: 'string' },
          bio: { type: 'string' },
          avatarUrl: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Post: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          content: { type: 'string' },
          imageUrl: { type: 'string' },
          authorId: { type: 'string' },
          author: { $ref: '#/components/schemas/User' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Auth'],
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'username', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  username: { type: 'string', minLength: 3 },
                  password: { type: 'string', minLength: 8 },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'User created successfully' } },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Login user',
        tags: ['Auth'],
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Login successful' } },
      },
    },
    '/api/users/{id}': {
      get: {
        summary: 'Get user profile',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'User profile' } },
      },
    },
    '/api/users/profile': {
      put: {
        summary: 'Update profile',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  bio: { type: 'string' },
                  avatarUrl: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Profile updated' } },
      },
    },
    '/api/users/{id}/follow': {
      post: {
        summary: 'Follow user',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Followed successfully' } },
      },
      delete: {
        summary: 'Unfollow user',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Unfollowed successfully' } },
      },
    },
    '/api/posts': {
      post: {
        summary: 'Create post',
        tags: ['Posts'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content'],
                properties: {
                  content: { type: 'string', maxLength: 280 },
                  imageUrl: { type: 'string', format: 'uri' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Post created' } },
      },
    },
    '/api/posts/feed': {
      get: {
        summary: 'Get feed (posts from followed users)',
        tags: ['Posts'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer' } },
          { in: 'query', name: 'limit', schema: { type: 'integer' } },
        ],
        responses: { '200': { description: 'Feed with pagination' } },
      },
    },
    '/api/posts/{id}': {
      get: {
        summary: 'Get post by ID',
        tags: ['Posts'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Post details' } },
      },
      put: {
        summary: 'Update post',
        tags: ['Posts'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  content: { type: 'string' },
                  imageUrl: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Post updated' } },
      },
      delete: {
        summary: 'Delete post',
        tags: ['Posts'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Post deleted' } },
      },
    },
    '/api/comments': {
      post: {
        summary: 'Add comment',
        tags: ['Comments'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['postId', 'content'],
                properties: {
                  postId: { type: 'string' },
                  content: { type: 'string', maxLength: 500 },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Comment added' } },
      },
    },
    '/api/comments/post/{postId}': {
      get: {
        summary: 'List comments for post',
        tags: ['Comments'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'postId', required: true, schema: { type: 'string' } },
          { in: 'query', name: 'page', schema: { type: 'integer' } },
          { in: 'query', name: 'limit', schema: { type: 'integer' } },
        ],
        responses: { '200': { description: 'Comments with pagination' } },
      },
    },
    '/api/comments/{id}': {
      delete: {
        summary: 'Delete comment',
        tags: ['Comments'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Comment deleted' } },
      },
    },
    '/api/reactions': {
      post: {
        summary: 'Like/React to post',
        tags: ['Reactions'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['postId', 'type'],
                properties: {
                  postId: { type: 'string' },
                  type: { type: 'string', enum: ['LIKE', 'LOVE', 'HAHA', 'WOW'] },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Reaction added' } },
      },
    },
    '/api/reactions/{id}': {
      delete: {
        summary: 'Remove reaction',
        tags: ['Reactions'],
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Reaction removed' } },
      },
    },
    '/api/notifications': {
      get: {
        summary: 'Get notifications',
        tags: ['Notifications'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer' } },
          { in: 'query', name: 'limit', schema: { type: 'integer' } },
        ],
        responses: { '200': { description: 'Notifications with pagination' } },
      },
    },
    '/api/health': {
      get: {
        summary: 'Health check',
        tags: ['Health'],
        security: [],
        responses: { '200': { description: 'API is running' } },
      },
    },
  },
};

module.exports = swaggerDefinition;
