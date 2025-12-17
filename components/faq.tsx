"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How fast can your team arrive at my property?",
    answer:
      "Our emergency response team is available 24/7 and can typically arrive at your property within 45-60 minutes anywhere in our service area. For locations outside our immediate service area, we provide an estimated arrival time when you call.",
  },
  {
    question: "Do you handle the insurance billing directly?",
    answer:
      "Yes, we work directly with all major insurance companies. Our team will document all damage thoroughly, provide detailed estimates, and communicate with your insurance adjuster to ensure you receive fair coverage for your claim. This takes the stress off you during an already difficult time.",
  },
  {
    question: "Is the mold in my house dangerous to my family?",
    answer:
      "Certain types of mold, particularly black mold (Stachybotrys), can pose serious health risks including respiratory issues, allergic reactions, and other symptoms. We recommend having any visible mold professionally assessed. Our team uses air quality testing to determine the type and severity of mold present.",
  },
  {
    question: "Can you save my hardwood floors after a flood?",
    answer:
      "In many cases, yes. Using specialized drying techniques including mat systems and controlled temperature/humidity environments, we can often save hardwood floors that other companies would tear out. The key is acting quickly—the sooner we begin the drying process, the better the outcome.",
  },
  {
    question: "What should I do while I wait for you to arrive?",
    answer:
      "If safe to do so, turn off the water source if it's a plumbing issue. Move valuables and important documents to a dry area. Take photos of all damage for insurance purposes. Do not use electrical appliances in affected areas. Open windows if weather permits to improve ventilation.",
  },
]

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  content?: {
    heading: string
    items: FAQItem[]
  }
}

export function FAQ({ content }: FAQProps) {
  const heading = content?.heading || "Frequently Asked Questions"
  const items = content?.items?.length ? content.items : faqs

  return (
    <section id="faq" className="py-24 lg:py-36 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-16">{heading}</h2>
        <Accordion type="single" collapsible className="space-y-5">
          {items.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-slate-200 rounded-xl px-8 data-[state=open]:bg-slate-50"
            >
              <AccordionTrigger className="text-left font-medium text-slate-900 hover:no-underline py-6 text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pb-6 leading-relaxed text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
