import { createClient } from "@/lib/supabase/server"
import { DEFAULT_TESTIMONIALS } from "@/lib/default-content"

export interface ContentHeader {
  id: number
  nav_home: string
  nav_services: string
  nav_areas: string
  nav_contact: string
  call_button_text: string
  our_links_spintax?: string | null
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
  roof_installation_title?: string | null
  roof_installation_description?: string | null
  roof_repair_title?: string | null
  roof_repair_description?: string | null
  shingle_roofing_title?: string | null
  shingle_roofing_description?: string | null
  metal_roofing_title?: string | null
  metal_roofing_description?: string | null
  commercial_roofing_title?: string | null
  commercial_roofing_description?: string | null
  emergency_leak_title?: string | null
  emergency_leak_description?: string | null
  mold_inspection_title?: string | null
  mold_inspection_description?: string | null
  mold_remediation_title?: string | null
  mold_remediation_description?: string | null
  black_mold_title?: string | null
  black_mold_description?: string | null
  water_damage_restoration_title?: string | null
  water_damage_restoration_description?: string | null
  commercial_mold_title?: string | null
  commercial_mold_description?: string | null
  air_quality_testing_title?: string | null
  air_quality_testing_description?: string | null
}

export interface ContentCTA {
  id: number
  headline_spintax: string
  subheadline_spintax: string
  chat_button_spintax: string
}

export interface ContentQuestionnaire {
  id: number
  category?: string | null
  h1_spintax: string | null
  subheadline_spintax: string | null
  step1_progress_spintax: string | null
  step1_question_spintax: string | null
  step2_progress_spintax: string | null
  step2_question_spintax: string | null
  step3_progress_spintax: string | null
  step3_question_spintax: string | null
  step3_helper_spintax: string | null
  step4_progress_spintax: string | null
  thank_you_headline_spintax: string | null
  thank_you_text_spintax: string | null
  review_prompt_spintax: string | null
  button_text_spintax: string | null
  cta_subtext_spintax: string | null
  back_link_spintax: string | null
}

export interface ContentServicePage {
  id?: number
  service_slug: string
  hero_headline_spintax: string | null
  hero_subheadline_spintax: string | null
  hero_cta_secondary_spintax: string | null
  section_headline_spintax: string | null
  section_body_spintax: string | null
  process_headline_spintax: string | null
  process_body_spintax: string | null
  midpage_cta_headline_spintax: string | null
  midpage_cta_subtext_spintax: string | null
  why_choose_headline_spintax: string | null
  trust_points_spintax: string | null
  meta_title_spintax?: string | null
  meta_description_spintax?: string | null
}

export interface ContentServiceArea {
  id?: number
  headline_spintax: string | null
  paragraph1_spintax: string | null
  paragraph2_spintax: string | null
  paragraph3_spintax: string | null
  paragraph4_spintax: string | null
  why_city_headline_spintax: string | null
  why_city_paragraph_spintax: string | null
  midpage_cta_headline_spintax: string | null
  midpage_cta_subtext_spintax: string | null
  why_choose_headline_spintax: string | null
  trust_points_spintax: string | null
  services_list_headline_spintax: string | null
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
  last_updated_spintax: string | null
  content_spintax: string | null
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

export interface LinkRow {
  id: number
  site_id: number
  title: string
  url: string
  description: string | null
  category: string | null
  sort_order: number | null
  created_at: string | null
}

export interface ContentTestimonials {
  id: number
  heading_spintax: string
  subheading_spintax: string
  items: ContentTestimonialItem[] | unknown
}

type LegacyTestimonialsRow = {
  heading_spintax?: string | null
  subheading_spintax?: string | null
  review1_text?: string | null
  review2_text?: string | null
  review3_text?: string | null
  review1_author?: string | null
  review2_author?: string | null
  review3_author?: string | null
  rating_count?: number | null
  category?: string | null
  items?: ContentTestimonialItem[] | unknown
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

export async function getContentHeader(category: string = "water_damage"): Promise<ContentHeader | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_header")
    .select("*")
    .eq("category", category)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Failed to fetch content_header:", error)
    return null
  }
  return (data as ContentHeader) ?? null
}

export async function getContentServicePage(
  serviceSlug: string,
  category: string = "water_damage",
): Promise<ContentServicePage | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_service_pages")
    .select("*")
    .eq("service_slug", serviceSlug)
    .eq("category", category)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Failed to fetch service page content:", error)
    return null
  }
  return (data as ContentServicePage) ?? null
}

export async function getContentServiceArea(category: string = "water_damage"): Promise<ContentServiceArea | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_service_area")
    .select("*")
    .eq("category", category)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Failed to fetch service area content:", error)
    return null
  }
  return (data as ContentServiceArea) ?? null
}

export async function getContentMeta(pageType: string, category: string = "water_damage"): Promise<ContentMeta | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_meta")
    .select("*")
    .eq("page_type", pageType)
    .eq("category", category)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Failed to fetch meta content:", error)
    return null
  }
  return (data as ContentMeta) ?? null
}

export async function getContentLegal(
  pageType: "privacy_policy" | "terms_of_use",
  category: string = "water_damage",
): Promise<ContentLegal | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_legal")
    .select("*")
    .eq("page_type", pageType)
    .eq("category", category)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Failed to fetch legal content:", error)
    return null
  }
  return data as ContentLegal
}

export async function getContentHero(category: string = "water_damage"): Promise<ContentHero | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_hero")
    .select("*")
    .eq("category", category)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Failed to fetch content_hero:", error)
    return null
  }
  return (data as ContentHero) ?? null
}

export async function getContentServices(category: string = "water_damage"): Promise<ContentService | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_services")
    .select("*")
    .eq("category", category)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Failed to fetch content_services:", error)
    return null
  }
  return (data as ContentService) ?? null
}

export async function getContentCTA(category: string = "water_damage"): Promise<ContentCTA | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_cta")
    .select("*")
    .eq("category", category)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Failed to fetch content_cta:", error)
    return null
  }
  return (data as ContentCTA) ?? null
}

export async function getContentSeoBody(category: string = "water_damage"): Promise<ContentSeoBody | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_seo_body")
    .select("*")
    .eq("category", category)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Failed to fetch content_seo_body:", error)
    return null
  }
  return (data as ContentSeoBody) ?? null
}

export async function getContentFAQ(category: string = "water_damage"): Promise<ContentFAQ | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_faq")
    .select("*")
    .eq("category", category)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Failed to fetch content_faq:", error)
    return null
  }
  return (data as ContentFAQ) ?? null
}

export async function fetchQuestionnaire(category: string = "water_damage"): Promise<ContentQuestionnaire | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_questionnaire")
    .select("*")
    .eq("category", category)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Failed to fetch content_questionnaire:", error)
    return null
  }

  return (data as ContentQuestionnaire) ?? null
}

export async function getContentTestimonials(category: string = "water_damage"): Promise<ContentTestimonials | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_testimonials")
    .select("*")
    .eq("category", category)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Failed to fetch content_testimonials:", error)
    return null
  }

  const row = (data as LegacyTestimonialsRow) ?? null
  if (!row) return null

  // If the table already stores items as JSON, return as-is for downstream parsing.
  if (row.items) return row as unknown as ContentTestimonials

  const fallbackNameSpintax = "{Sarah|Jennifer|Michelle|Amanda|Lisa} {M|R|T|S|K}."
  const fallbackTextSpintax =
    "{They arrived fast and explained everything clearly|Professional service from start to finish|Quick response and thorough work}. " +
    "The team was {professional|helpful|knowledgeable} and {helped us through|guided us through|assisted with} the {insurance process|entire process|restoration work}."

  const fallbackTexts = [fallbackTextSpintax, fallbackTextSpintax, fallbackTextSpintax]
  const items: ContentTestimonialItem[] = [1, 2, 3]
    .map((idx) => {
      const text = String((row as Record<string, unknown>)[`review${idx}_text`] ?? '').trim()
      const author = String((row as Record<string, unknown>)[`review${idx}_author`] ?? '').trim()

      const text_spintax = text || fallbackTexts[idx - 1]
      const name = author || fallbackNameSpintax

      return {
        name,
        location_spintax: "{{city}}, {{state}}",
        text_spintax,
        rating: 5,
      }
    })
    .filter((item) => Boolean(item.text_spintax))

  return {
    id: (data as { id?: number }).id ?? 0,
    heading_spintax: row.heading_spintax || DEFAULT_TESTIMONIALS.heading_spintax,
    subheading_spintax: row.subheading_spintax || DEFAULT_TESTIMONIALS.subheading_spintax,
    items,
  }
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

export async function fetchLinks(siteId: number): Promise<LinkRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("links")
    .select("id,site_id,title,url,description,category,sort_order,created_at")
    .eq("site_id", siteId)
    .order("sort_order", { ascending: true, nullsFirst: true })
    .order("id", { ascending: true })

  if (error) {
    const msg = error.message || ""
    if (msg.toLowerCase().includes("does not exist")) return []
    throw new Error(`Supabase error fetching links: ${error.message}`)
  }

  return (data ?? []).map((row) => {
    const r = row as Partial<LinkRow>
    const categoryValue = r.category
    const category = categoryValue == null ? null : String(categoryValue).trim()
    return {
      id: Number(r.id ?? 0),
      site_id: Number(r.site_id ?? siteId),
      title: String(r.title ?? "").trim(),
      url: String(r.url ?? "").trim(),
      description: (r.description ?? null) as string | null,
      category,
      sort_order: (r.sort_order ?? null) as number | null,
      created_at: (r.created_at ?? null) as string | null,
    }
  })
}
