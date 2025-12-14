import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for our restoration services website.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white pb-16 pt-32">
      <div className="container mx-auto max-w-4xl px-4">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>

        <p className="mb-8 text-gray-600">
          <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-bold">1. Introduction</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              We are committed to protecting your privacy and ensuring the security of your personal information. This
              Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our
              website or contact us about services.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">2. Information We Collect</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              We may collect personal information that you voluntarily provide to us when you contact us, request
              services, or interact with our website.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">3. How We Use Your Information</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              We use the information we collect to respond to inquiries, provide and improve our services, communicate
              with you, and comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">4. Data Security</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              We implement appropriate security measures to protect your personal information from unauthorized access,
              disclosure, alteration, or destruction.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">5. Your Rights</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              You may have the right to access, correct, or delete your personal information depending on your
              jurisdiction. Please contact us to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">6. Contact Us</h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              If you have any questions about this Privacy Policy, please contact us through our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
