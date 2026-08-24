import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">BidPulse Portal</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your assembly orders, internal margins, and operations queue.
        </p>
        
        <div className="mt-6 flex flex-col space-y-4">
          <Link
            href="/login"
            className="w-full flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign In / Admin Login
          </Link>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  )
}
