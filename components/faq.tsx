import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { LocationData } from "@/lib/get-location-data";

interface FAQProps {
  locationData?: LocationData;
}

export function FAQ({ locationData }: FAQProps) {
  const city = locationData?.city;
  const state = locationData?.state;
  const business_name = locationData?.business_name || 'Our team';

  const faqs = [
    {
      question: 'How often should I have my roof inspected?',
      answer:
        'We recommend having your roof professionally inspected at least once a year, ideally in spring or fall. Additionally, you should schedule an inspection after any major storm or weather event. Regular inspections help identify minor issues before they become costly repairs.',
    },
    {
      question: 'What does a roof inspection include?',
      answer:
        'Our comprehensive roof inspection includes examining the shingles, flashing, gutters, ventilation, underlayment, and structural integrity. We check for leaks, damaged or missing shingles, signs of water damage, and potential problem areas. You\'ll receive a detailed report with our findings and recommendations.',
    },
    {
      question: 'How long does a roof replacement take?',
      answer:
        'Most residential roof replacements take 1-3 days depending on the size of your roof, weather conditions, and the complexity of the job. We work efficiently while ensuring quality installation and will keep you informed throughout the entire process.',
    },
    {
      question: 'Do you offer emergency roof repair services?',
      answer:
        'Yes! We provide 24/7 emergency roof repair services for urgent situations like storm damage, severe leaks, or structural issues. Our team responds quickly to prevent further damage to your property and protect your home.',
    },
    {
      question: 'Are you licensed and insured?',
      answer:
        `Absolutely. ${business_name} is fully licensed, bonded, and insured. Our roofing contractors are trained professionals who follow industry best practices and comply with all local building codes and safety standards.`,
    },
    {
      question: 'Do you help with insurance claims for roof damage?',
      answer:
        'Yes, we have extensive experience working with insurance companies. We can provide detailed documentation, photos, and assessments needed for your claim. Our team will work with you and your insurance adjuster throughout the entire process.',
    },
    {
      question: 'What areas do you service?',
      answer:
        city && state
          ? `We proudly serve ${city}, ${state} and surrounding communities. Contact us to confirm service in your specific area.`
          : 'We proudly serve the local area and surrounding communities. Contact us to confirm service in your specific area.',
    },
  ];

  return (
    <section className="py-20 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-neutral-dark text-center mb-12 leading-relaxed">
            {city
              ? `Get answers to common questions about our roofing installation, repair, and maintenance services in ${city}.`
              : 'Get answers to common questions about our roofing installation, repair, and maintenance services.'
            }
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-lg px-6 border-neutral-light"
              >
                <AccordionTrigger className="text-left font-bold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-neutral-dark leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  )
}

export default FAQ
