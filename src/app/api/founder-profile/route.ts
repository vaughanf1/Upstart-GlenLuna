import { NextRequest, NextResponse } from 'next/server'
import { getAllProfiles, createProfile, updateProfile } from '@/lib/json-db'

// For simplicity, we'll use a default profile ID
// In a real app with auth, this would be the user's ID
const DEFAULT_PROFILE_ID = '1'

export async function GET() {
  try {
    const profiles = getAllProfiles()
    const profile = profiles.find(p => p.id === DEFAULT_PROFILE_ID)

    if (!profile) {
      return NextResponse.json({ profile: null })
    }

    return NextResponse.json(profile)
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
    const body = await request.json()

    const profiles = getAllProfiles()
    const existingProfile = profiles.find(p => p.id === DEFAULT_PROFILE_ID)

    let profile
    if (existingProfile) {
      profile = updateProfile(DEFAULT_PROFILE_ID, body)
    } else {
      profile = createProfile({
        ...body,
        name: body.name || 'Anonymous Founder',
        email: body.email || 'founder@example.com',
      })
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
