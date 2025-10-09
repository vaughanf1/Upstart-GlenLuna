import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await db.founderProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Parse JSON fields
    const profileData = {
      ...profile,
      industryExperience: profile.industryExperience
        ? JSON.parse(profile.industryExperience)
        : [],
      preferredBuildTypes: profile.preferredBuildTypes
        ? JSON.parse(profile.preferredBuildTypes)
        : [],
      preferredTags: profile.preferredTags
        ? JSON.parse(profile.preferredTags)
        : [],
      avoidTags: profile.avoidTags
        ? JSON.parse(profile.avoidTags)
        : [],
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error('Error fetching founder profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const {
      technicalSkills,
      designSkills,
      marketingSkills,
      salesSkills,
      industryExperience,
      yearsExperience,
      riskTolerance,
      timeCommitment,
      fundingCapacity,
      preferredBuildTypes,
      preferredTags,
      avoidTags,
    } = body

    // Upsert founder profile
    const profile = await db.founderProfile.upsert({
      where: { userId: session.user.id },
      update: {
        technicalSkills,
        designSkills,
        marketingSkills,
        salesSkills,
        industryExperience: JSON.stringify(industryExperience || []),
        yearsExperience,
        riskTolerance,
        timeCommitment,
        fundingCapacity,
        preferredBuildTypes: JSON.stringify(preferredBuildTypes || []),
        preferredTags: JSON.stringify(preferredTags || []),
        avoidTags: JSON.stringify(avoidTags || []),
      },
      create: {
        userId: session.user.id,
        technicalSkills,
        designSkills,
        marketingSkills,
        salesSkills,
        industryExperience: JSON.stringify(industryExperience || []),
        yearsExperience,
        riskTolerance,
        timeCommitment,
        fundingCapacity,
        preferredBuildTypes: JSON.stringify(preferredBuildTypes || []),
        preferredTags: JSON.stringify(preferredTags || []),
        avoidTags: JSON.stringify(avoidTags || []),
      }
    })

    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        industryExperience: JSON.parse(profile.industryExperience || '[]'),
        preferredBuildTypes: JSON.parse(profile.preferredBuildTypes || '[]'),
        preferredTags: JSON.parse(profile.preferredTags || '[]'),
        avoidTags: JSON.parse(profile.avoidTags || '[]'),
      }
    })
  } catch (error) {
    console.error('Error saving founder profile:', error)
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    )
  }
}