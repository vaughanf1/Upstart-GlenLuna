// Script to migrate scraped ideas to the new JSON format
import fs from 'fs';
import path from 'path';

const scrapedIdeasPath = path.join(process.cwd(), 'data', 'scraped-ideas.json');
const newIdeasPath = path.join(process.cwd(), 'data', 'ideas.json');

interface ScrapedIdea {
  title: string;
  description: string;
  url?: string;
  slug: string;
  isIdeaOfTheDay?: boolean;
}

interface NewIdea {
  id: string;
  title: string;
  description: string;
  slug: string;
  url?: string;
  isIdeaOfTheDay?: boolean;
  marketScore?: number;
  difficulty?: number;
  buildType?: string;
  tags?: string[];
  createdAt: string;
}

// Read scraped ideas
const scrapedIdeas: ScrapedIdea[] = JSON.parse(
  fs.readFileSync(scrapedIdeasPath, 'utf8')
);

// Convert to new format
const newIdeas: NewIdea[] = scrapedIdeas.map((idea, index) => ({
  id: (index + 1).toString(),
  title: idea.title,
  description: idea.description,
  slug: idea.slug,
  url: idea.url,
  isIdeaOfTheDay: idea.isIdeaOfTheDay || false,
  marketScore: Math.floor(Math.random() * 40) + 60, // Random score 60-100
  difficulty: Math.floor(Math.random() * 3) + 2, // Random difficulty 2-4
  buildType: ['SaaS', 'Platform', 'Marketplace', 'Tool'][Math.floor(Math.random() * 4)],
  tags: extractTags(idea.title, idea.description),
  createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
}));

// Write to new file
fs.writeFileSync(newIdeasPath, JSON.stringify(newIdeas, null, 2), 'utf8');

console.log(`✅ Migrated ${newIdeas.length} ideas to ${newIdeasPath}`);

// Helper function to extract tags from title and description
function extractTags(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const possibleTags = [
    'AI', 'SaaS', 'automation', 'productivity', 'marketing', 'e-commerce',
    'real estate', 'climate', 'healthcare', 'fintech', 'compliance',
    'local business', 'marketplace', 'developer tools', 'analytics'
  ];

  const tags = possibleTags.filter(tag =>
    text.includes(tag.toLowerCase())
  );

  return tags.length > 0 ? tags : ['startup'];
}
