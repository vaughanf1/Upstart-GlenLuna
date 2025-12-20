# Supabase Authentication Setup Guide

This document provides instructions for completing the Supabase authentication setup for your Glen Luna project.

## What's Been Set Up

The following authentication features have been implemented:

1. **Email/Password Authentication**
   - Sign up page: `/auth/signup`
   - Sign in page: `/auth/signin`
   - Forgot password page: `/auth/forgot-password`
   - Reset password page: `/auth/reset-password`

2. **Google OAuth Integration**
   - Google sign-in button on both sign-in and sign-up pages

3. **Supabase Client Configuration**
   - Browser client: `src/lib/supabase/client.ts`
   - Server client: `src/lib/supabase/server.ts`
   - Middleware: `src/lib/supabase/middleware.ts` and `middleware.ts`

4. **UI Components**
   - Input component
   - Toast notifications
   - User navigation component with sign out

## Required Steps to Complete Setup

### 1. Verify Supabase Credentials

Your environment variables have been set, but please verify you're using the correct anon key:

1. Go to your Supabase project dashboard: https://app.supabase.com/project/xgluijusqechxvadybya
2. Navigate to **Settings** > **API**
3. Copy the **anon public** key (it should be a long JWT token)
4. Update your `.env.local` file with the correct key:

```env
NEXT_PUBLIC_SUPABASE_URL="https://xgluijusqechxvadybya.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-actual-anon-key-here"
```

### 2. Configure Google OAuth Provider

To enable Google sign-in, you need to configure the Google OAuth provider in Supabase:

1. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - Select **Web application**
   - Add authorized redirect URIs:
     - `https://xgluijusqechxvadybya.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for local development)
   - Copy your **Client ID** and **Client Secret**

2. **Configure in Supabase:**
   - Go to your Supabase project dashboard
   - Navigate to **Authentication** > **Providers**
   - Find **Google** and enable it
   - Paste your Google **Client ID** and **Client Secret**
   - Click **Save**

### 3. Configure Email Settings (Optional but Recommended)

By default, Supabase uses their email service, but you can configure your own SMTP:

1. Go to **Authentication** > **Email Templates**
2. Customize the email templates for:
   - Confirm signup
   - Reset password
   - Magic link

### 4. Test the Authentication Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the following flows:
   - Sign up with email/password
   - Check your email for confirmation
   - Sign in with email/password
   - Test forgot password flow
   - Test Google OAuth sign-in

## Using Authentication in Your App

### Get Current User (Server Component)

```tsx
import { createClient } from '@/lib/supabase/server'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  return <div>Hello {user.email}</div>
}
```

### Get Current User (Client Component)

```tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ClientComponent() {
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [supabase])

  return <div>{user?.email}</div>
}
```

### Sign Out

Use the `UserNav` component:

```tsx
import { UserNav } from '@/components/auth/user-nav'

export default function Header() {
  return (
    <header>
      {/* Your header content */}
      <UserNav />
    </header>
  )
}
```

### Protect Routes

The middleware is already set up to refresh sessions. To protect specific pages:

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Your protected page content
}
```

## Database Schema

Supabase automatically creates the `auth.users` table. If you need to store additional user data:

1. Go to **Database** > **Tables**
2. Create a new table (e.g., `profiles`)
3. Add a column `id` of type `uuid` with a foreign key to `auth.users.id`
4. Create a trigger to automatically create a profile when a user signs up

Example SQL:

```sql
-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a trigger to create a profile on user signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## Troubleshooting

### Google OAuth not working
- Verify redirect URIs are correct in Google Cloud Console
- Check that Google provider is enabled in Supabase
- Ensure Client ID and Secret are correctly entered

### Email confirmation not received
- Check your Supabase email settings
- Look in spam folder
- Consider setting up custom SMTP

### Session not persisting
- Ensure middleware is properly configured
- Check that cookies are not being blocked
- Verify NEXT_PUBLIC_SUPABASE_URL is correct

## Next Steps

1. Verify and update your Supabase anon key
2. Configure Google OAuth
3. Test all authentication flows
4. Customize email templates
5. Add user profile functionality if needed

For more information, visit the [Supabase Documentation](https://supabase.com/docs/guides/auth).
