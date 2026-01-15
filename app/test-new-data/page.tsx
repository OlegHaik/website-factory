import { getAllContentNew } from "@/lib/fetch-content-new"
import { processSpintax } from "@/lib/spintax"

export default async function TestNewDataPage() {
  const category = "water_damage"
  const content = await getAllContentNew(category)
  
  const mockLocation = {
    city: "Los Angeles",
    state: "California",
    phone: "(555) 123-4567",
    business_name: "Water Damage Pros"
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Тест нових даних</h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* FAQ */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">FAQ ({content.faqs.length})</h2>
          {content.faqs.slice(0, 3).map((faq, i) => (
            <div key={i} className="mb-4">
              <p className="font-bold">Q: {processSpintax(faq.question, mockLocation).substring(0, 80)}...</p>
              <p className="text-gray-600">A: {processSpintax(faq.answer, mockLocation).substring(0, 100)}...</p>
            </div>
          ))}
        </section>
        
        {/* Testimonials */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Testimonials ({content.testimonials.length})</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {content.testimonials.map((t, i) => (
              <div key={i} className="border rounded p-4">
                <p className="text-sm mb-2">"{processSpintax(t.text, mockLocation).substring(0, 80)}..."</p>
                <p className="font-bold">- {processSpintax(t.name, mockLocation)}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Services */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Services ({content.services.length})</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {content.services.map((s, i) => (
              <div key={i} className="border rounded p-4">
                <h3 className="font-bold">{processSpintax(s.nameSpin, mockLocation)}</h3>
                <p className="text-sm text-gray-600">{processSpintax(s.description, mockLocation).substring(0, 60)}...</p>
              </div>
            ))}
          </div>
        </section>
        
        <div className="bg-green-100 border border-green-500 rounded p-4 text-center">
          <p className="font-bold text-green-700">✅ Всі дані завантажені успішно!</p>
        </div>
      </div>
    </div>
  )
}
