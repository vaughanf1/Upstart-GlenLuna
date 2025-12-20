'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Copy, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function SetupPage() {
  const [copied, setCopied] = useState(false)

  const sqlScript = `-- Supabase Schema for Glen Luna
-- Run this SQL in your Supabase SQL Editor

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
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON public.profiles(updated_at DESC);`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">Database Setup Required</CardTitle>
            <p className="text-gray-600 mt-2">
              To enable authentication and the Founder Fit Quiz, you need to set up your Supabase database tables.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm">1</span>
                  Copy the SQL Script
                </h3>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto max-h-96 text-sm">
                    {sqlScript}
                  </pre>
                  <Button
                    onClick={copyToClipboard}
                    className="absolute top-4 right-4 bg-white text-gray-900 hover:bg-gray-100"
                    size="sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy SQL
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm">2</span>
                  Open Supabase SQL Editor
                </h3>
                <a
                  href="https://app.supabase.com/project/xgluijusqechxvadybya/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button className="bg-green-600 hover:bg-green-700">
                    Open SQL Editor
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm">3</span>
                  Paste and Run
                </h3>
                <p className="text-gray-600">
                  Paste the SQL into the editor and click <strong>RUN</strong> to execute it.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm">4</span>
                  Test Your Setup
                </h3>
                <div className="flex gap-4 flex-wrap">
                  <Link href="/auth/signin">
                    <Button variant="outline">
                      Test Sign In
                    </Button>
                  </Link>
                  <Link href="/founder-fit">
                    <Button variant="outline">
                      Test Founder Fit Quiz
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline">
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What This Sets Up</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>User Profiles:</strong> Stores Founder Fit Quiz responses for each user</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Matched Ideas:</strong> Saves personalized startup idea recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Row Level Security:</strong> Ensures users can only access their own data</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Auto Profile Creation:</strong> Creates a profile automatically when users sign up</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
