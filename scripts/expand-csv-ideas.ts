import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface CSVRow {
  Title: string;
  Description: string;
}

interface ExpandedIdea {
  id: string;
  title: string;
  description: string;
  slug: string;
  url: string;
  isIdeaOfTheDay: boolean;
  marketScore: number;
  difficulty: number;
  buildType: string;
  tags: string[];
  createdAt: string;
  score: number;
  pitch?: string;
  summary?: string;
  problem?: string;
  solution?: string;
  opportunityScore?: number;
  problemScore?: number;
  feasibilityScore?: number;
  whyNowScore?: number;
  goToMarketScore?: number;
  executionDifficulty?: number;
  revenuePotential?: string;
  mvpTimeline?: string;
  marketGap?: string;
  unfairAdvantage?: string;
  whyNow?: string;
  trendAnalysis?: string;
  targetUser?: string;
  targetMarket?: string;
  pricingModel?: any[];
  executionPlan?: any[];
  goToMarketStrategy?: any[];
  proofSignals?: string[] | string;
  scoreBreakdown?: any;
  sources?: any[];
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 60);
}

async function expandIdea(csvRow: CSVRow, index: number): Promise<ExpandedIdea> {
  const prompt = `You are analyzing a startup idea to generate comprehensive metrics and analysis. Given the title and description below, generate a detailed JSON response with all the required fields.

Title: ${csvRow.Title}
Description: ${csvRow.Description}

Generate a JSON object with these fields (use the description to extract or infer the data):

{
  "marketScore": <number 1-100>,
  "difficulty": <number 1-5>,
  "buildType": "<one of: SaaS, AI Agent, Mobile App, Web App, API, Tool, Platform, Marketplace>",
  "tags": [<array of 2-6 relevant tags like "AI", "SaaS", "automation", "marketing", etc>],
  "score": <overall score 1-10>,
  "pitch": "<1-2 sentence compelling pitch>",
  "summary": "<2-3 sentence summary of what this does>",
  "problem": "<clear problem statement, 2-3 sentences>",
  "solution": "<clear solution statement, 2-3 sentences>",
  "opportunityScore": <number 1-10>,
  "problemScore": <number 1-10>,
  "feasibilityScore": <number 1-10>,
  "whyNowScore": <number 1-10>,
  "goToMarketScore": <number 1-10>,
  "executionDifficulty": <number 1-10>,
  "revenuePotential": "<e.g., '$5M ARR at 1,000 customers'>",
  "mvpTimeline": "<e.g., '3-4 months'>",
  "marketGap": "<what's missing in the market, 2-3 sentences>",
  "unfairAdvantage": "<key competitive advantage, 1-2 sentences>",
  "whyNow": "<why this opportunity exists now, 2-3 sentences>",
  "trendAnalysis": "<relevant market trends, 2-3 sentences>",
  "targetUser": "<description of ideal customer, 2-3 sentences>",
  "targetMarket": "<market segment like 'Small Businesses', 'SaaS Founders', etc>",
  "pricingModel": [
    {
      "type": "<pricing tier name>",
      "price": "<price point>",
      "description": "<what's included>"
    }
  ],
  "executionPlan": [
    {
      "phase": "<phase name>",
      "details": "<what to do in this phase>"
    }
  ],
  "goToMarketStrategy": [
    {
      "channel": "<marketing channel>",
      "tactics": "<specific tactics>",
      "investment": "<budget estimate>",
      "expectedCAC": "<customer acquisition cost>"
    }
  ],
  "proofSignals": [
    "<evidence this could work>",
    "<market signal>"
  ],
  "scoreBreakdown": {
    "opportunity": <1-10>,
    "problem": <1-10>,
    "solution": <1-10>,
    "market": <1-10>,
    "timing": <1-10>
  }
}

Extract or intelligently infer these values from the description. Make scores realistic and varied. Return ONLY the JSON object, no other text.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from response (handle potential markdown code blocks)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const aiData = JSON.parse(jsonMatch[0]);

    const slug = generateSlug(csvRow.Title);

    return {
      id: String(index + 6), // Start from 6 since we have 5 existing ideas
      title: csvRow.Title,
      description: csvRow.Description,
      slug,
      url: `https://www.ideabrowser.com/idea/${slug}`,
      isIdeaOfTheDay: false,
      createdAt: new Date().toISOString(),
      ...aiData,
    };
  } catch (error) {
    console.error(`Error expanding idea ${index}:`, error);
    // Return a basic version if AI fails
    const slug = generateSlug(csvRow.Title);
    return {
      id: String(index + 6),
      title: csvRow.Title,
      description: csvRow.Description,
      slug,
      url: `https://www.ideabrowser.com/idea/${slug}`,
      isIdeaOfTheDay: false,
      marketScore: 50,
      difficulty: 3,
      buildType: 'SaaS',
      tags: ['startup'],
      score: 5,
      createdAt: new Date().toISOString(),
    };
  }
}

async function main() {
  console.log('Starting CSV idea expansion...');

  // Read CSV file
  const csvPath = path.join(process.cwd(), '800ideas.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const records: CSVRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`Found ${records.length} ideas to process`);

  // Read existing ideas
  const ideasPath = path.join(process.cwd(), 'data', 'ideas.json');
  let existingIdeas: ExpandedIdea[] = [];

  if (fs.existsSync(ideasPath)) {
    existingIdeas = JSON.parse(fs.readFileSync(ideasPath, 'utf-8'));
    console.log(`Found ${existingIdeas.length} existing ideas`);
  }

  // Process ideas in batches to avoid rate limits
  const batchSize = 5;
  const expandedIdeas: ExpandedIdea[] = [];

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)}...`);

    const batchPromises = batch.map((row, batchIndex) =>
      expandIdea(row, i + batchIndex)
    );

    const batchResults = await Promise.all(batchPromises);
    expandedIdeas.push(...batchResults);

    // Save progress periodically
    if ((i + batchSize) % 50 === 0 || i + batchSize >= records.length) {
      const allIdeas = [...existingIdeas, ...expandedIdeas];
      fs.writeFileSync(ideasPath, JSON.stringify(allIdeas, null, 2));
      console.log(`Saved progress: ${expandedIdeas.length} new ideas added`);
    }

    // Small delay to avoid rate limits
    if (i + batchSize < records.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Final save
  const allIdeas = [...existingIdeas, ...expandedIdeas];
  fs.writeFileSync(ideasPath, JSON.stringify(allIdeas, null, 2));

  console.log(`\nComplete! Added ${expandedIdeas.length} new ideas.`);
  console.log(`Total ideas in database: ${allIdeas.length}`);
}

main().catch(console.error);
