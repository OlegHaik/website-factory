import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="text-4xl font-bold text-slate-400">404</span>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Page Not Found
                </h1>

                <p className="text-slate-600 mb-6">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>

                <Link
                    href="/"
                    className="inline-block w-full py-3 px-4 bg-[var(--accent-primary,#2563eb)] hover:bg-[var(--warm-med,#1d4ed8)] text-white font-semibold rounded-lg transition-colors"
                >
                    Return Home
                </Link>
            </div>
        </div>
    )
}
