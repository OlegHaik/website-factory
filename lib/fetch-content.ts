/**
 * Fetch functions для НОВИХ таблиць (_new suffix)
 * Використовує структуру з MASTER_SPINTEXT
 */

import { createClient } from "@/lib/supabase/server"
import { normalizeCategory } from "@/lib/content-guard"

// =====================================================
// Types для нових структур
// =====================================================

export interface ContentHeroNew {
  id: number
  category: string
  headline_spintax: string
  subheadline_spintax: string
  chat_button_spintax?: string | null
}

export interface ContentHeaderNew {
  id: number
  category: string
  nav_home: string
  nav_services: string
  nav_areas: string
  nav_contact: string
  call_button_text: string
  our_links_spintax?: string | null
}

export interface ContentCTANew {
  id: number
  category: string
  headline_spintax: string
  subheadline_spintax: string
  chat_button_spintax?: string | null
}

export interface ContentFAQItem {
  question: string
  answer: string
}

export interface ContentTestimonialNew {
  name: string
  text: string
  rating: number
}

export interface ContentServiceNew {
  id: string
  name: string
  nameSpin: string
  slug: string
  description: string
}

export interface ContentMetaNew {
  title: string
  description: string
}

// =====================================================
// HERO - нова структура
// =====================================================

export async function getContentHeroNew(category: string = "water_damage"): Promise<ContentHeroNew | null> {
  const normalizedCategory = normalizeCategory(category)
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("content_hero")
    .select("*")
    .eq("category", normalizedCategory)
    .maybeSingle()
  
  if (error) {
    console.error("Failed to fetch content_hero:", error)
    return null
  }
  
  return data as ContentHeroNew | null
}

// =====================================================
// HEADER - нова структура
// =====================================================

export async function getContentHeaderNew(category: string = "water_damage"): Promise<ContentHeaderNew | null> {
  const normalizedCategory = normalizeCategory(category)
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("content_header")
    .select("*")
    .eq("category", normalizedCategory)
    .maybeSingle()
  
  if (error) {
    console.error("Failed to fetch content_header:", error)
    return null
  }
  
  return data as ContentHeaderNew | null
}

// =====================================================
// CTA - нова структура
// =====================================================

export async function getContentCTANew(category: string = "water_damage"): Promise<ContentCTANew | null> {
  const normalizedCategory = normalizeCategory(category)
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("content_cta")
    .select("*")
    .eq("category", normalizedCategory)
    .maybeSingle()
  
  if (error) {
    console.error("Failed to fetch content_cta:", error)
    return null
  }
  
  return data as ContentCTANew | null
}

// =====================================================
// FAQ - нова структура (192 rows)
// Структура: q1, a1, q2, a2, q3, a3... (12 пар на категорію)
// =====================================================

export async function getContentFAQNew(category: string = "water_damage"): Promise<ContentFAQItem[]> {
  const normalizedCategory = normalizeCategory(category)
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("content_faq")
    .select("*")
    .eq("category", normalizedCategory)
    .order("faq_id")
  
  if (error || !data) {
    console.error("Failed to fetch content_faq:", error)
    return []
  }
  
  // Групуємо питання та відповіді (q1+a1, q2+a2, etc.)
  const faqs: ContentFAQItem[] = []
  
  for (let i = 0; i < data.length; i += 2) {
    const questionRow = data[i]
    const answerRow = data[i + 1]
    
    if (questionRow?.faq_id.startsWith('q') && answerRow?.faq_id.startsWith('a')) {
      faqs.push({
        question: questionRow.content,
        answer: answerRow.content
      })
    }
  }
  
  return faqs
}

// =====================================================
// TESTIMONIALS - нова структура (100 rows)
// 15 відгуків на категорію, показуємо перші 3
// =====================================================

export async function getContentTestimonialsNew(
  category: string = "water_damage",
  limit: number = 3
): Promise<ContentTestimonialNew[]> {
  const normalizedCategory = normalizeCategory(category)
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("content_testimonials")
    .select("*")
    .eq("category", normalizedCategory)
    .order("testimonial_num")
    .limit(limit)
  
  if (error || !data) {
    console.error("Failed to fetch content_testimonials:", error)
    return []
  }
  
  return data.map(t => ({
    name: t.testimonial_name,
    text: t.testimonial_body,
    rating: t.rating || 5
  }))
}

// =====================================================
// SERVICES - нова структура (96 rows)
// 6 послуг на категорію
// =====================================================

export async function getContentServicesNew(category: string = "water_damage"): Promise<ContentServiceNew[]> {
  const normalizedCategory = normalizeCategory(category)
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("content_services")
    .select("*")
    .eq("category", normalizedCategory)
    .order("service_id")
  
  if (error || !data) {
    console.error("Failed to fetch content_services:", error)
    return []
  }
  
  return data.map(s => ({
    id: s.service_id,
    name: s.service_name,
    nameSpin: s.service_name_spin,
    slug: s.service_slug,
    description: s.svc_grid_desc
  }))
}

// =====================================================
// META - нова структура (176 rows)
// page_type: home, service, area, terms, privacy
// =====================================================

export async function getContentMetaNew(
  category: string = "water_damage",
  pageType: string = "home",
  serviceId?: string
): Promise<ContentMetaNew | null> {
  const normalizedCategory = normalizeCategory(category)
  const supabase = await createClient()
  
  let query = supabase
    .from("content_meta")
    .select("*")
    .eq("category", normalizedCategory)
    .eq("page_type", pageType)
  
  // Якщо є service_id - фільтруємо по ньому
  if (serviceId) {
    query = query.eq("service_id", serviceId)
  } else {
    query = query.is("service_id", null)
  }
  
  const { data, error } = await query.maybeSingle()
  
  if (error) {
    console.error("Failed to fetch content_meta:", error)
    return null
  }
  
  if (!data) {
    return null
  }
  
  return {
    title: data.meta_title,
    description: data.meta_desc
  }
}

// =====================================================
// Утилітна функція для отримання ВСІХ даних категорії
// =====================================================

export async function getAllContentNew(category: string = "water_damage") {
  const [hero, header, cta, faqs, testimonials, services, meta] = await Promise.all([
    getContentHeroNew(category),
    getContentHeaderNew(category),
    getContentCTANew(category),
    getContentFAQNew(category),
    getContentTestimonialsNew(category, 3),
    getContentServicesNew(category),
    getContentMetaNew(category, "home")
  ])
  
  return {
    hero,
    header,
    cta,
    faqs,
    testimonials,
    services,
    meta
  }
}

// =====================================================
// Alias для сумісності зі старим кодом
// =====================================================

export const getContentHero = getContentHeroNew
export const getContentHeader = getContentHeaderNew
export const getContentCTA = getContentCTANew
export const getContentFAQ = getContentFAQNew
export const getContentTestimonials = getContentTestimonialsNew
export const getContentServices = getContentServicesNew
export const getContentMeta = getContentMetaNew
export const getAllContent = getAllContentNew

// =====================================================
// Додаткові функції для сумісності
// =====================================================

export interface ContentBlock {
  id: number
  category: string
  block_key: string
  heading_spintax?: string | null
  body_spintax?: string | null
  global_order?: number | null
}

export async function getContentSeoBody(category: string = "water_damage") {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_seo_body")
    .select("*")
    .eq("category", normalizeCategory(category))
    .maybeSingle()
  
  if (error) {
    console.error("Failed to fetch content_seo_body:", error)
    return null
  }
  return data
}

export async function getContentBlocks(category: string = "water_damage") {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_blocks")
    .select("*")
    .eq("category", normalizeCategory(category))
    .order("global_order")
  
  if (error) {
    console.error("Failed to fetch content_blocks:", error)
    return []
  }
  return data as ContentBlock[]
}

export async function getContentBlock(category: string, blockKey: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_blocks")
    .select("*")
    .eq("category", normalizeCategory(category))
    .eq("block_key", blockKey)
    .maybeSingle()
  
  if (error) {
    console.error("Failed to fetch content_block:", error)
    return null
  }
  return data as ContentBlock | null
}

export function parseFAQItems(faqs: ContentFAQItem[]) {
  return faqs
}

export function parseTestimonialItems(testimonials: ContentTestimonialNew[]) {
  return testimonials
}

export async function getContentServicePage(serviceSlug: string, category: string = "water_damage") {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_service_pages")
    .select("*")
    .eq("category", normalizeCategory(category))
    .eq("service_slug", serviceSlug)
    .maybeSingle()
  
  if (error) {
    console.error("Failed to fetch content_service_page:", error)
    return null
  }
  return data
}

export async function getContentServiceArea(category: string = "water_damage") {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_service_area")
    .select("*")
    .eq("category", normalizeCategory(category))
    .maybeSingle()
  
  if (error) {
    console.error("Failed to fetch content_service_area:", error)
    return null
  }
  return data
}

export async function fetchQuestionnaire(category: string = "water_damage") {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_questionnaire")
    .select("*")
    .eq("category", normalizeCategory(category))
    .maybeSingle()
  
  if (error) {
    console.error("Failed to fetch questionnaire:", error)
    return null
  }
  return data
}

export async function fetchLinks(category: string = "water_damage") {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("category", normalizeCategory(category))
  
  if (error) {
    console.error("Failed to fetch links:", error)
    return []
  }
  return data
}

export async function getContentLegal(category: string = "water_damage") {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_legal")
    .select("*")
    .eq("category", normalizeCategory(category))
    .maybeSingle()
  
  if (error) {
    console.error("Failed to fetch content_legal:", error)
    return null
  }
  return data
}
