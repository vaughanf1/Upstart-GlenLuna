import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return NextResponse.json(profile || null)
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
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const profileData = {
      id: user.id,
      email: user.email,
      technical_skills: body.technicalSkills,
      design_skills: body.designSkills,
      marketing_skills: body.marketingSkills,
      sales_skills: body.salesSkills,
      industry_experience: body.industryExperience,
      years_experience: body.yearsExperience,
      risk_tolerance: body.riskTolerance,
      time_commitment: body.timeCommitment,
      funding_capacity: body.fundingCapacity,
      preferred_build_types: body.preferredBuildTypes,
      preferred_tags: body.preferredTags,
      updated_at: new Date().toISOString(),
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      profile
    })
  } catch (error) {
    console.error('Error saving founder profile:', error)
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    )
  }
}
