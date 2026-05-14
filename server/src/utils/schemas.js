// DigitalEra - Zod Validation Schemas
const { z } = require('zod');

// ─── Auth Schemas ───
const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// ─── Article Schemas ───
const createArticleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().optional(),
  categoryId: z.number().int().positive('Valid category ID is required'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
});

const updateArticleSchema = createArticleSchema.partial();

// ─── Category Schemas ───
const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
});

// ─── Tag Schemas ───
const tagSchema = z.object({
  name: z.string().min(2, 'Tag name must be at least 2 characters'),
});

// ─── Comment Schemas ───
const commentSchema = z.object({
  content: z.string().min(3, 'Comment must be at least 3 characters'),
  articleId: z.number().int().positive(),
});

module.exports = {
  loginSchema,
  registerSchema,
  createArticleSchema,
  updateArticleSchema,
  categorySchema,
  tagSchema,
  commentSchema,
};
