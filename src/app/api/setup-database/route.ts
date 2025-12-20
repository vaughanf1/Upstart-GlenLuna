import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // SQL to create tables and policies
    const setupSQL = `
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT,
  technical_skills INTEGER,
  design_skills INTEGER,
  marketing_skills INTEGER,
  sales_skills INTEGER,
  industry_experience TEXT[],
  years_experience INTEGER,
  risk_tolerance INTEGER,
  time_commitment TEXT,
  funding_capacity TEXT,
  preferred_build_types TEXT[],
  preferred_tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create matched_ideas table
CREATE TABLE IF NOT EXISTS public.matched_ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  idea_slug TEXT NOT NULL,
  idea_title TEXT NOT NULL,
  idea_description TEXT,
  match_score DECIMAL(5,2) NOT NULL,
  match_reasons TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matched_ideas ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own matched ideas" ON public.matched_ideas;
DROP POLICY IF EXISTS "Users can insert their own matched ideas" ON public.matched_ideas;
DROP POLICY IF EXISTS "Users can delete their own matched ideas" ON public.matched_ideas;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Matched ideas policies
CREATE POLICY "Users can view their own matched ideas"
  ON public.matched_ideas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own matched ideas"
  ON public.matched_ideas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own matched ideas"
  ON public.matched_ideas FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_matched_ideas_user_id ON public.matched_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_matched_ideas_match_score ON public.matched_ideas(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON public.profiles(updated_at DESC);
    `

    // Execute the SQL using Supabase's RPC or direct SQL execution
    // Note: This requires the service role key with elevated permissions
    const { error } = await supabase.rpc('exec_sql', { sql: setupSQL })

    if (error) {
      // If RPC doesn't work, we need to use the management API
      console.error('Error executing SQL:', error)

      return NextResponse.json({
        success: false,
        message: 'Database setup requires manual SQL execution',
        instructions: 'Please run the SQL in supabase-schema.sql file in your Supabase SQL Editor',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully!'
    })
  } catch (error: any) {
    console.error('Error setting up database:', error)

    return NextResponse.json({
      success: false,
      message: 'Database setup requires manual SQL execution',
      instructions: 'Please go to: https://app.supabase.com/project/xgluijusqechxvadybya/sql/new and paste the contents of supabase-schema.sql',
      error: error.message
    }, { status: 500 })
  }
}
