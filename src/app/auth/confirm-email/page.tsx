import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: { email?: string }
}) {
  const email = searchParams.email

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-600 mb-4">
              We&apos;ve sent a confirmation link to{' '}
              {email && <strong>{email}</strong>}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Click the link in the email to confirm your account and sign in.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                For Development: Skip Email Confirmation
              </h3>
              <p className="text-xs text-yellow-700 mb-3">
                To disable email confirmation during development:
              </p>
              <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
                <li>Go to your Supabase dashboard</li>
                <li>Navigate to Authentication &gt; Providers</li>
                <li>Click on Email provider</li>
                <li>Toggle off &quot;Confirm email&quot;</li>
                <li>Save changes</li>
              </ol>
              <a
                href="https://app.supabase.com/project/xgluijusqechxvadybya/auth/providers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-yellow-800 hover:text-yellow-900 underline mt-2 inline-block"
              >
                Open Supabase Settings →
              </a>
            </div>

            <Link href="/auth/signin">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
