import { createClient } from "@/lib/supabase/server"

export interface ContentHeader {
  id: number
  nav_home: string
  nav_services: string
  nav_areas: string
  nav_contact: string
  call_button_text: string
}

export interface ContentHero {
  id: number
  headline_spintax: string
  subheadline_spintax: string
  chat_button_spintax: string
}

export interface ContentService {
  id: number
  water_title: string
  water_description: string
  fire_title: string
  fire_description: string
  mold_title: string
  mold_description: string
  biohazard_title: string
  biohazard_description: string
  burst_title: string
  burst_description: string
  sewage_title: string
  sewage_description: string
}

export interface ContentCTA {
  id: number
  headline_spintax: string
  subheadline_spintax: string
  chat_button_spintax: string
}

export interface ContentServicePage {
  id: number
  service_slug: string
  hero_headline_spintax: string | null
  hero_description_spintax: string | null
  intro_spintax: string | null
  process_title_spintax: string | null
  process_spintax: string | null
  why_choose_title_spintax: string | null
  why_choose_spintax: string | null
  cta_headline_spintax: string | null
  cta_description_spintax: string | null
}

export interface ContentServiceArea {
  id: number
  hero_headline_spintax: string | null
  hero_description_spintax: string | null
  intro_title_spintax: string | null
  intro_spintax: string | null
  services_title_spintax: string | null
  services_intro_spintax: string | null
  why_choose_title_spintax: string | null
  why_choose_spintax: string | null
  cta_headline_spintax: string | null
  cta_description_spintax: string | null
}

export interface ContentMeta {
  id: number
  page_type: string
  title_spintax: string | null
  description_spintax: string | null
}

export interface ContentLegal {
  id: number
  page_type: "privacy_policy" | "terms_of_use" | (string & {})
  title: string | null
  intro_spintax: string | null
  content_spintax: string | null
  last_updated: string | null
}

export interface ContentSeoBody {
  id: number
  intro_spintax: string
  why_choose_title_spintax: string
  why_choose_spintax: string
  process_title_spintax: string
  process_spintax: string
}

export interface ContentFAQItem {
  question_spintax: string
  answer_spintax: string
}

export interface ContentFAQ {
  id: number
  heading_spintax: string
  items: ContentFAQItem[] | unknown
}

export interface ContentTestimonialItem {
  name: string
  location_spintax: string
  text_spintax: string
  rating: number
}

export interface ContentTestimonials {
  id: number
  heading_spintax: string
  subheading_spintax: string
  items: ContentTestimonialItem[] | unknown
}

export interface ContentMap {
  header?: number
  hero?: number
  services?: number
  faq?: number
  testimonials?: number
  cta?: number
  seo_body?: number
  service_area?: number
}

export async function getContentHeader(id: number): Promise<ContentHeader | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("content_header").select("*").eq("id", id).single()

  if (error) {
    console.error("Failed to fetch content_header:", error)
    return null
  }
  return data as ContentHeader
}

export async function getContentServicePage(serviceSlug: string): Promise<ContentServicePage | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_service_pages")
    .select("*")
    .eq("service_slug", serviceSlug)
    .single()

  if (error) {
    console.error("Failed to fetch service page content:", error)
    return null
  }
  return data as ContentServicePage
}

export async function getContentServiceArea(id: number = 1): Promise<ContentServiceArea | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("content_service_area").select("*").eq("id", id).single()

  if (error) {
    console.error("Failed to fetch service area content:", error)
    return null
  }
  return data as ContentServiceArea
}

export async function getContentMeta(pageType: string): Promise<ContentMeta | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("content_meta").select("*").eq("page_type", pageType).single()

  if (error) {
    console.error("Failed to fetch meta content:", error)
    return null
  }
  return data as ContentMeta
}

export async function getContentLegal(pageType: "privacy_policy" | "terms_of_use"): Promise<ContentLegal | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("content_legal").select("*").eq("page_type", pageType).single()

  if (error) {
    console.error("Failed to fetch legal content:", error)
    return null
  }
  return data as ContentLegal
}

export async function getContentHero(id: number): Promise<ContentHero | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("content_hero").select("*").eq("id", id).single()

  if (error) {
    console.error("Failed to fetch content_hero:", error)
    return null
  }
  return data as ContentHero
}

export async function getContentServices(id: number): Promise<ContentService | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("content_services").select("*").eq("id", id).single()

  if (error) {
    console.error("Failed to fetch content_services:", error)
    return null
  }
  return data as ContentService
}

export async function getContentCTA(id: number): Promise<ContentCTA | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("content_cta").select("*").eq("id", id).single()

  if (error) {
    console.error("Failed to fetch content_cta:", error)
    return null
  }
  return data as ContentCTA
}

export async function getContentSeoBody(id: number): Promise<ContentSeoBody | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("content_seo_body").select("*").eq("id", id).single()

  if (error) {
    console.error("Failed to fetch content_seo_body:", error)
    return null
  }
  return data as ContentSeoBody
}

export async function getContentFAQ(id: number): Promise<ContentFAQ | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("content_faq").select("*").eq("id", id).single()

  if (error) {
    console.error("Failed to fetch content_faq:", error)
    return null
  }
  return data as ContentFAQ
}

export async function getContentTestimonials(id: number): Promise<ContentTestimonials | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("content_testimonials").select("*").eq("id", id).single()

  if (error) {
    console.error("Failed to fetch content_testimonials:", error)
    return null
  }
  return data as ContentTestimonials
}

function safeArray<T>(value: unknown): T[] {
  if (!value) return []
  if (Array.isArray(value)) return value as T[]
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown
      return Array.isArray(parsed) ? (parsed as T[]) : []
    } catch {
      return []
    }
  }
  return []
}

export function parseFAQItems(value: unknown): ContentFAQItem[] {
  return safeArray<ContentFAQItem>(value)
    .map((item) => {
      const it = item as Partial<ContentFAQItem>
      const question_spintax = String(it.question_spintax ?? "").trim()
      const answer_spintax = String(it.answer_spintax ?? "").trim()
      if (!question_spintax || !answer_spintax) return null
      return { question_spintax, answer_spintax }
    })
    .filter((x): x is ContentFAQItem => Boolean(x))
}

export function parseTestimonialItems(value: unknown): ContentTestimonialItem[] {
  return safeArray<ContentTestimonialItem>(value)
    .map((item) => {
      const it = item as Partial<ContentTestimonialItem>
      const name = String(it.name ?? "").trim()
      const location_spintax = String(it.location_spintax ?? "").trim()
      const text_spintax = String(it.text_spintax ?? "").trim()
      const rating = Number(it.rating ?? 5)
      if (!name || !text_spintax) return null
      return {
        name,
        location_spintax: location_spintax || "{{city}}, {{state}}",
        text_spintax,
        rating: Number.isFinite(rating) ? Math.max(1, Math.min(5, rating)) : 5,
      }
    })
    .filter((x): x is ContentTestimonialItem => Boolean(x))
}

export function parseContentMap(jsonData: unknown): ContentMap {
  if (!jsonData) return {}
  if (typeof jsonData === "string") {
    try {
      return JSON.parse(jsonData) as ContentMap
    } catch {
      return {}
    }
  }
  return jsonData as ContentMap
}
