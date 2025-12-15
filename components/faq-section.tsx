'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export function FaqSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1" className="bg-white rounded-lg border">
            <AccordionTrigger className="px-6 py-4 font-semibold text-base">
              How fast can your team arrive at my property?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-600 text-base">
              We offer 60-minute response times for emergency calls in our service area. Our technicians are on
              standby 24/7.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-white rounded-lg border">
            <AccordionTrigger className="px-6 py-4 font-semibold text-base">
              Do you handle the insurance billing directly?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-600 text-base">
              Yes, we work directly with all major insurance companies and can bill them directly, reducing your
              out-of-pocket stress.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-white rounded-lg border">
            <AccordionTrigger className="px-6 py-4 font-semibold text-base">
              Is the mold in my house dangerous to my family?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-600 text-base">
              Some molds can cause health issues. We recommend professional inspection to assess the type and extent
              of mold growth.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="bg-white rounded-lg border">
            <AccordionTrigger className="px-6 py-4 font-semibold text-base">
              Can you save my hardwood floors after a flood?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-600 text-base">
              In many cases, yes. Quick action and proper drying techniques can save hardwood floors from permanent
              damage.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="bg-white rounded-lg border">
            <AccordionTrigger className="px-6 py-4 font-semibold text-base">
              What should I do while I wait for you to arrive?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-600 text-base">
              Turn off the water source if possible, move valuables to dry areas, and avoid walking through standing
              water for safety.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}
