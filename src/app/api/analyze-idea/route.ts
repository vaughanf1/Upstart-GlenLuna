import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Increase timeout for AI analysis (60 seconds)
export const maxDuration = 60

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const EXPERT_PROMPT = `You are an expert startup advisor and idea analyst. Your role is to provide comprehensive, actionable analysis of startup ideas.

When analyzing an idea, you should:
1. Identify the core problem and validate if it's worth solving
2. Assess market opportunity and timing ("why now")
3. Evaluate the proposed solution and its differentiation
4. Analyze target market and go-to-market strategy
5. Identify potential revenue models and pricing strategies
6. Outline execution steps and MVP timeline
7. Highlight risks, challenges, and unfair advantages
8. Provide proof points and market signals

Your analysis should be:
- Data-driven and realistic
- Specific and actionable
- Honest about challenges and risks
- Structured in clear sections
- Professional but conversational

Format your response as a comprehensive JSON object with these sections:
{
  "summary": "2-3 sentence executive summary",
  "problem": "Detailed problem description",
  "solution": "Solution description and differentiation",
  "marketGap": "What gap this fills in the market",
  "targetUser": "Who the ideal customer is",
  "targetMarket": "B2B, B2C, or B2B2C",
  "whyNow": "Why this is the right time for this idea",
  "unfairAdvantage": "What could give this idea an edge",
  "opportunityScore": 7, // 1-10 rating
  "problemScore": 8, // 1-10 rating
  "feasibilityScore": 6, // 1-10 rating
  "whyNowScore": 7, // 1-10 rating
  "revenuePotential": "$1M-$5M ARR",
  "executionDifficulty": 6, // 1-10 rating
  "goToMarketScore": 7, // 1-10 rating
  "pricingModel": [
    {
      "type": "Freemium",
      "price": "Free - $99/mo",
      "description": "Description of pricing tier"
    }
  ],
  "executionPlan": [
    {
      "phase": "Phase 1: MVP",
      "timeline": "Months 1-3",
      "details": "What to build and validate"
    }
  ],
  "goToMarketStrategy": [
    {
      "channel": "Content Marketing",
      "tactics": "Specific tactics to use"
    }
  ],
  "proofSignals": [
    "Market signal or proof point 1",
    "Market signal or proof point 2"
  ],
  "trendAnalysis": "Analysis of relevant trends",
  "competitorAnalysis": {
    "directCompetitors": ["Competitor 1", "Competitor 2"],
    "indirectCompetitors": ["Alternative 1"],
    "differentiation": "How this idea is different"
  },
  "risks": ["Risk 1", "Risk 2"],
  "recommendations": ["Next step 1", "Next step 2"]
}

Be thorough, specific, and actionable. Think like a VC evaluating an investment opportunity.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idea, title, description, targetMarket, additionalContext } = body

    if (!idea && !title) {
      return NextResponse.json(
        { error: 'Please provide either an idea or title' },
        { status: 400 }
      )
    }

    // Construct the user message
    let userMessage = ''
    if (title) {
      userMessage = `Idea Title: ${title}\n\n`
    }
    if (description) {
      userMessage += `Description: ${description}\n\n`
    }
    if (targetMarket) {
      userMessage += `Target Market: ${targetMarket}\n\n`
    }
    if (additionalContext) {
      userMessage += `Additional Context: ${additionalContext}\n\n`
    }
    if (idea && !title) {
      userMessage = `Idea: ${idea}\n\n`
    }

    userMessage += `\nPlease provide a comprehensive analysis of this startup idea. Return only valid JSON as specified in your instructions, no additional text.`

    console.log('[AI Agent] Analyzing idea:', title || idea?.substring(0, 50))

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      temperature: 0.7,
      system: EXPERT_PROMPT,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    })

    // Extract the response
    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from Claude')
    }

    // Parse the JSON response
    let analysis
    try {
      // Try to extract JSON from the response
      const text = content.text
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        analysis = JSON.parse(text)
      }
    } catch (parseError) {
      console.error('[AI Agent] Failed to parse JSON:', content.text)
      // Return a structured error response
      return NextResponse.json({
        error: 'Failed to parse analysis',
        rawResponse: content.text,
      }, { status: 500 })
    }

    console.log('[AI Agent] Analysis complete')

    return NextResponse.json({
      success: true,
      analysis,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    })

  } catch (error: any) {
    console.error('[AI Agent] Error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to analyze idea',
        details: error.toString(),
      },
      { status: 500 }
    )
  }
}
