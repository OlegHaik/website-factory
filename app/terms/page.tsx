import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for our chimney sweep services',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <p className="text-gray-600 mb-8">
          <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
        </p>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">By accessing our website or using our chimney sweep services, you agree to be bound by these Terms of Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Services Provided</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We provide professional chimney sweep, cleaning, repair, air duct cleaning, and dryer vent cleaning services performed by licensed and insured professionals.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Service Appointments</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Service appointments must be scheduled in advance. Cancellations with less than 24 hours notice may be subject to a cancellation fee.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Pricing and Payment</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Payment is due upon completion of services. We accept cash, checks, and major credit cards.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Warranties</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We stand behind our workmanship and offer warranties on our services. Warranty terms will be provided at the time of service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from our services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to our website.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Contact</h2>
            <p className="text-gray-700 leading-relaxed mb-4">If you have any questions about these Terms of Service, please contact us through our website.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
