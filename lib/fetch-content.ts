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

export interface ContentMap {
  header?: number
  hero?: number
  services?: number
  faq?: number
  testimonials?: number
  cta?: number
  seo_body?: number
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
