import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().min(1).optional(),
  SCORING_MODE: z.enum(['local', 'n8n']).default('local').optional(),
  N8N_WEBHOOK_URL: z.string().url().optional(),
  REDIS_URL: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Use safeParse to avoid throwing errors during build
const parsed = envSchema.safeParse(process.env)

export const env = parsed.success ? parsed.data : {
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  SCORING_MODE: (process.env.SCORING_MODE as 'local' | 'n8n') || 'local',
  N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
  REDIS_URL: process.env.REDIS_URL,
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
}