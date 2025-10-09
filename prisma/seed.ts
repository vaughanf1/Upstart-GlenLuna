import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generateMockScore } from '../src/lib/signals/mock/aggregator'

const prisma = new PrismaClient()

const IDEAS_DATA = [
  {
    title: "AI-Powered Code Review Assistant",
    slug: "ai-powered-code-review-assistant",
    summary: "An intelligent code review tool that automatically identifies bugs, security vulnerabilities, and suggests improvements using advanced AI models trained on millions of code repositories.",
    problem: "Manual code reviews are time-consuming, inconsistent, and often miss critical issues. Many teams struggle with maintaining code quality at scale, especially with remote work and tight deadlines.",
    solution: "Our AI assistant provides instant, comprehensive code reviews with detailed explanations, learning from your team's coding patterns and industry best practices to deliver personalized feedback.",
    targetUser: "Software development teams, tech startups, and enterprise engineering organizations looking to improve code quality and developer productivity.",
    whyNow: "The rise of AI language models like GPT-4 and CodeT5 has made sophisticated code analysis accessible. Remote work has increased the need for automated quality assurance tools.",
    difficulty: 4,
    buildType: "SaaS",
    tags: ["AI", "DevTools", "Productivity", "Code Quality", "Machine Learning"]
  },
  {
    title: "Micro-Learning Platform for Busy Professionals",
    slug: "micro-learning-platform-busy-professionals",
    summary: "A bite-sized learning platform that delivers 5-minute skill-building modules during work breaks, commutes, or downtime, with personalized learning paths and progress tracking.",
    problem: "Professionals want to continuously learn and upskill but struggle to find time for traditional courses. Long-form content doesn't fit into busy schedules and often leads to incomplete learning.",
    solution: "Break down complex skills into digestible 5-minute modules that can be consumed anywhere, anytime. Use spaced repetition and AI to optimize learning retention and create personalized curricula.",
    targetUser: "Working professionals aged 25-45 who want to advance their careers but have limited time for traditional learning methods.",
    whyNow: "The Great Resignation has made upskilling crucial for career advancement. Mobile-first learning consumption is now mainstream, and AI can personalize learning at scale.",
    difficulty: 3,
    buildType: "Mobile App",
    tags: ["EdTech", "Mobile", "Productivity", "AI", "Personalization"]
  },
  {
    title: "Smart Home Energy Optimization",
    slug: "smart-home-energy-optimization",
    summary: "An IoT platform that automatically optimizes home energy usage by learning family patterns and coordinating smart devices to reduce electricity bills by up to 30%.",
    problem: "Rising energy costs and climate concerns drive demand for energy efficiency, but most homeowners don't know how to optimize their usage or coordinate multiple smart devices effectively.",
    solution: "Install smart sensors and connect to existing smart home devices to create an intelligent energy management system that learns usage patterns and automatically optimizes consumption.",
    targetUser: "Environmentally conscious homeowners with smart home devices who want to reduce energy costs and carbon footprint.",
    whyNow: "Energy prices are at historic highs, climate awareness is growing, and smart home device adoption has reached critical mass. Government incentives support energy efficiency investments.",
    difficulty: 5,
    buildType: "IoT Platform",
    tags: ["IoT", "Sustainability", "Smart Home", "Energy", "Automation"]
  },
  {
    title: "Virtual Interior Design Marketplace",
    slug: "virtual-interior-design-marketplace",
    summary: "A platform connecting homeowners with interior designers for virtual consultations and 3D room makeovers, making professional design accessible and affordable.",
    problem: "Professional interior design is expensive and inaccessible to most people. DIY solutions lack expertise, while traditional design services require in-person visits and high fees.",
    solution: "Enable virtual design consultations with 3D visualization tools, allowing designers to work remotely and serve more clients while reducing costs for homeowners.",
    targetUser: "Homeowners and renters who want professional design help but find traditional services too expensive or inconvenient.",
    whyNow: "Remote work has increased focus on home environments. 3D visualization technology is more accessible, and the gig economy has created demand for flexible design services.",
    difficulty: 3,
    buildType: "Marketplace",
    tags: ["Design", "Marketplace", "3D", "Home", "Remote Services"]
  },
  {
    title: "Automated Personal Finance Coach",
    slug: "automated-personal-finance-coach",
    summary: "An AI-powered financial advisor that analyzes spending patterns, provides personalized budgeting advice, and automatically optimizes savings and investments for individual goals.",
    problem: "Many people struggle with personal finance management and can't afford traditional financial advisors. Generic budgeting apps don't provide personalized guidance or adapt to changing circumstances.",
    solution: "Use AI to analyze financial behavior, provide contextual advice, and automate savings/investment decisions based on individual goals, risk tolerance, and life changes.",
    targetUser: "Young professionals and families who want to improve their financial health but lack access to personalized financial advice.",
    whyNow: "Economic uncertainty has highlighted the need for better financial planning. Open banking APIs make financial data integration easier, and AI can now provide sophisticated analysis.",
    difficulty: 4,
    buildType: "FinTech",
    tags: ["FinTech", "AI", "Personal Finance", "Automation", "SaaS"]
  },
  {
    title: "Local Services Booking Platform",
    slug: "local-services-booking-platform",
    summary: "A hyperlocal platform for booking home services like cleaning, repairs, and maintenance with instant pricing, availability, and quality guarantees.",
    problem: "Finding reliable local service providers is difficult and time-consuming. Pricing is opaque, scheduling is inconvenient, and quality is inconsistent.",
    solution: "Create a trusted marketplace with vetted providers, transparent pricing, real-time availability, and service guarantees to make booking local services as easy as ordering food.",
    targetUser: "Busy homeowners and property managers who need reliable, convenient access to quality local service providers.",
    whyNow: "The gig economy has created a large pool of service providers. Mobile payments and scheduling tools make on-demand services feasible at scale.",
    difficulty: 3,
    buildType: "Marketplace",
    tags: ["Marketplace", "Local Services", "On-Demand", "Mobile", "Gig Economy"]
  },
  {
    title: "Mental Health Support Chatbot",
    slug: "mental-health-support-chatbot",
    summary: "An AI-powered mental health companion that provides 24/7 emotional support, coping strategies, and crisis intervention with seamless handoff to human therapists when needed.",
    problem: "Mental health support is expensive, has long wait times, and isn't available 24/7. Many people need immediate support during crisis moments but can't access professional help.",
    solution: "Provide always-available AI support trained on therapy techniques, with ability to recognize crisis situations and connect users to human professionals when needed.",
    targetUser: "Individuals seeking mental health support who face barriers to traditional therapy due to cost, availability, or stigma.",
    whyNow: "Mental health awareness has increased dramatically post-pandemic. AI therapy tools are becoming more sophisticated, and telehealth adoption has made virtual care mainstream.",
    difficulty: 5,
    buildType: "AI Agent",
    tags: ["HealthTech", "AI", "Mental Health", "Support", "Crisis Intervention"]
  },
  {
    title: "Creator Economy Analytics Dashboard",
    slug: "creator-economy-analytics-dashboard",
    summary: "A unified analytics platform that aggregates data from all creator platforms (YouTube, TikTok, Instagram, etc.) to provide actionable insights and optimization recommendations.",
    problem: "Content creators struggle to understand their performance across multiple platforms, make data-driven decisions, and optimize their content strategy due to fragmented analytics.",
    solution: "Integrate with all major creator platforms to provide unified analytics, trend analysis, audience insights, and AI-powered content optimization recommendations in one dashboard.",
    targetUser: "Content creators, influencers, and creator economy businesses who want to optimize their multi-platform strategy and grow their audience.",
    whyNow: "The creator economy has exploded to $104B+ and creators need professional tools to manage their businesses across multiple platforms effectively.",
    difficulty: 3,
    buildType: "Analytics Platform",
    tags: ["Creator Economy", "Analytics", "Social Media", "Content", "SaaS"]
  },
  {
    title: "Zero-Waste Grocery Delivery",
    slug: "zero-waste-grocery-delivery",
    summary: "A sustainable grocery delivery service using reusable containers and packaging-free products to eliminate single-use packaging waste while providing fresh, local produce.",
    problem: "Online grocery delivery generates enormous packaging waste. Environmentally conscious consumers want sustainable options but struggle to find convenient, waste-free shopping alternatives.",
    solution: "Partner with local farms and producers to deliver packaging-free groceries in reusable containers, with a return system for containers and focus on zero-waste products.",
    targetUser: "Environmentally conscious consumers who want convenient grocery delivery without the environmental impact of traditional services.",
    whyNow: "Climate awareness is at an all-time high, single-use plastic bans are expanding, and consumers are willing to pay premiums for sustainable alternatives.",
    difficulty: 4,
    buildType: "Delivery Service",
    tags: ["Sustainability", "Delivery", "Food", "Environment", "Local"]
  },
  {
    title: "AI-Powered Email Scheduling Assistant",
    slug: "ai-powered-email-scheduling-assistant",
    summary: "An intelligent email tool that learns your communication patterns and automatically suggests optimal send times, follow-up reminders, and email prioritization.",
    problem: "Email overwhelm reduces productivity and important messages get lost or forgotten. People struggle to manage email timing and follow-ups effectively.",
    solution: "Use AI to analyze email patterns, recipient behavior, and context to automatically optimize send times, set smart reminders, and prioritize important communications.",
    targetUser: "Business professionals, salespeople, and anyone who relies heavily on email communication for work.",
    whyNow: "Remote work has increased email volume significantly. AI email tools are becoming more sophisticated and email remains the primary business communication channel.",
    difficulty: 2,
    buildType: "Productivity Tool",
    tags: ["Productivity", "AI", "Email", "Automation", "Business Tools"]
  }
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Create roles
  console.log('Creating roles...')
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  })

  const memberRole = await prisma.role.upsert({
    where: { name: 'member' },
    update: {},
    create: { name: 'member' },
  })

  // Create admin user
  console.log('Creating admin user...')
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@upstart.com' },
    update: {},
    create: {
      email: 'admin@upstart.com',
      name: 'Admin User',
      passwordHash: hashedPassword,
      roles: {
        connect: [{ id: adminRole.id }]
      }
    },
  })

  // Create sample user
  console.log('Creating sample user...')
  const userPassword = await bcrypt.hash('user123', 12)

  const sampleUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Sample User',
      passwordHash: userPassword,
      roles: {
        connect: [{ id: memberRole.id }]
      }
    },
  })

  // Create ideas with scores
  console.log('Creating ideas and generating scores...')

  for (const ideaData of IDEAS_DATA) {
    // Check if idea already exists
    const existingIdea = await prisma.idea.findUnique({
      where: { slug: ideaData.slug }
    })

    if (existingIdea) {
      console.log(`Idea "${ideaData.title}" already exists, skipping...`)
      continue
    }

    // Generate mock score for this idea
    const scoringResult = await generateMockScore(ideaData.slug, {
      title: ideaData.title,
      tags: ideaData.tags,
      problem: ideaData.problem,
      solution: ideaData.solution,
      targetUser: ideaData.targetUser,
      whyNow: ideaData.whyNow,
    })

    // Create the idea with score (convert JSON to strings for SQLite)
    const idea = await prisma.idea.create({
      data: {
        ...ideaData,
        tags: JSON.stringify(ideaData.tags),
        score: scoringResult.score,
        scoreBreakdown: JSON.stringify(scoringResult.breakdown),
        sources: JSON.stringify(scoringResult.sources),
        lastScoredAt: new Date(),
      }
    })

    console.log(`Created idea: "${idea.title}" with score ${idea.score}`)
  }

  // Set today's idea (highest scoring idea)
  console.log('Setting today\'s idea...')
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const existingDailyIdea = await prisma.dailyIdea.findUnique({
    where: { date: today }
  })

  if (!existingDailyIdea) {
    const topIdea = await prisma.idea.findFirst({
      orderBy: { score: 'desc' }
    })

    if (topIdea) {
      await prisma.dailyIdea.create({
        data: {
          ideaId: topIdea.id,
          date: today,
        }
      })
      console.log(`Set "${topIdea.title}" as today's idea`)
    }
  }

  // Add some sample bookmarks
  console.log('Adding sample bookmarks...')
  const ideas = await prisma.idea.findMany({ take: 3 })

  for (const idea of ideas) {
    await prisma.bookmark.upsert({
      where: {
        userId_ideaId: {
          userId: sampleUser.id,
          ideaId: idea.id,
        }
      },
      update: {},
      create: {
        userId: sampleUser.id,
        ideaId: idea.id,
      }
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log('\n📋 Summary:')
  console.log(`- Created ${IDEAS_DATA.length} ideas with AI-generated scores`)
  console.log('- Created admin user: admin@upstart.com (password: admin123)')
  console.log('- Created sample user: user@example.com (password: user123)')
  console.log('- Set today\'s idea')
  console.log('- Added sample bookmarks')
  console.log('\n🚀 You can now run: pnpm dev')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })