'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log error to monitoring service in production
        console.error('Page error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Something went wrong
                </h1>

                <p className="text-slate-600 mb-6">
                    We apologize for the inconvenience. Please try again or contact support if the problem persists.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={reset}
                        className="w-full py-3 px-4 bg-[var(--accent-primary,#2563eb)] hover:bg-[var(--warm-med,#1d4ed8)] text-white font-semibold rounded-lg transition-colors"
                    >
                        Try Again
                    </button>

                    <a
                        href="/"
                        className="block w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                    >
                        Return Home
                    </a>
                </div>

                {error.digest && (
                    <p className="mt-6 text-xs text-slate-400">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    )
}
