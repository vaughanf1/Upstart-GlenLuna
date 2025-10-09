import { z } from 'zod'

export const createIdeaSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  problem: z.string().min(10, 'Problem description must be at least 10 characters'),
  solution: z.string().min(10, 'Solution description must be at least 10 characters'),
  targetUser: z.string().optional(),
  whyNow: z.string().optional(),
  difficulty: z.number().int().min(1).max(5),
  buildType: z.string().min(1, 'Build type is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(10),
})

export const updateIdeaSchema = createIdeaSchema.partial().extend({
  id: z.string().cuid(),
})

export const ideaFiltersSchema = z.object({
  tags: z.array(z.string()).optional(),
  difficulty: z.array(z.number().int().min(1).max(5)).optional(),
  buildType: z.array(z.string()).optional(),
  minScore: z.number().min(0).max(100).optional(),
  maxScore: z.number().min(0).max(100).optional(),
  bookmarked: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['score', 'createdAt', 'updatedAt']).default('score'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const scoreUpdateSchema = z.object({
  ideaId: z.string().cuid(),
  score: z.number().min(0).max(100),
  breakdown: z.object({
    trend: z.number().min(0).max(100),
    search: z.number().min(0).max(100),
    community: z.number().min(0).max(100),
    news: z.number().min(0).max(100),
    competition: z.number().min(0).max(100),
    quality: z.number().min(0).max(100),
  }),
  sources: z.array(z.object({
    type: z.string(),
    url: z.string().url(),
    meta: z.record(z.any()).optional(),
  })).optional(),
})

export type CreateIdeaInput = z.infer<typeof createIdeaSchema>
export type UpdateIdeaInput = z.infer<typeof updateIdeaSchema>
export type IdeaFilters = z.infer<typeof ideaFiltersSchema>
export type ScoreUpdateInput = z.infer<typeof scoreUpdateSchema>