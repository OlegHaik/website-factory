import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of use for our restoration services website.',
}

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-white pb-16 pt-32">
      <div className="container mx-auto max-w-4xl px-4">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="mb-8 text-4xl font-bold">Terms of Use</h1>

        <p className="mb-8 text-gray-600">
          <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-bold">1. Acceptance of Terms</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              By accessing our website, you agree to be bound by these Terms of Use.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">2. Services and Information</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              Information on this website is provided for general informational purposes and does not constitute legal or
              professional advice.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">3. Limitation of Liability</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or
              consequential damages arising from use of this website.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">4. Changes to Terms</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon
              posting.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">5. Contact</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              If you have any questions about these Terms of Use, please contact us through our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
