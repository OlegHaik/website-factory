import { notFound } from 'next/navigation'
import { getCitationsForSite, resolveSiteContext } from '@/lib/sites'
import { AuroraHeader } from '@/components/aurora-header'
import { AuroraFooter } from '@/components/aurora-footer'

export const dynamic = 'force-dynamic'

export default async function LinksPage() {
  const { site } = await resolveSiteContext()
  if (!site) return notFound()

  if (!site.business_name) throw new Error('Site is missing required field: business_name')

  const nav = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Service Areas', href: '/#areas' },
    { label: 'Contact', href: '/#contact' },
  ]

  const citations = await getCitationsForSite(site.id)
  const links = citations.length > 0 ? citations : site.links ?? []
  if (!links || links.length === 0) notFound()

  return (
    <div className="min-h-screen bg-white">
      <AuroraHeader businessName={site.business_name} nav={nav} phone={site.phone || ''} />

      <main className="pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-extrabold text-slate-900">{site.business_name} Around the Web</h1>
            <p className="mt-2 text-sm text-slate-600">
              Find all our business listings, social profiles, and web presence across the internet.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="nofollow"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <AuroraFooter businessName={site.business_name} city={site.city} state={site.state} socialLinks={site.socialLinks} />
    </div>
  )
}
