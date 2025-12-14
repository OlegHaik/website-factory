export type SpintextVariables = Record<string, string | number | boolean | null | undefined>

export interface SpintextOptions {
  /**
   * Seed for deterministic output. Same input+seed => same output.
   * If omitted, output is non-deterministic.
   */
  seed?: string

  /**
   * Max iterations for resolving spin blocks (safety guard).
   * Nested spin blocks are not a goal, but this allows repeated passes.
   */
  maxPasses?: number

  /**
   * What to do when a {{var}} is missing.
   * - keep: leaves {{var}} as-is
   * - empty: replaces with ''
   */
  missingVariable?: 'keep' | 'empty'
}

function hashStringToUint32(input: string): number {
  // FNV-1a 32-bit
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

function mulberry32(seed: number) {
  return function random() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function createRng(seed?: string): () => number {
  if (!seed) return Math.random
  return mulberry32(hashStringToUint32(seed))
}

function replaceVariables(input: string, vars: SpintextVariables, missing: 'keep' | 'empty'): string {
  return input.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_m, key: string) => {
    const value = vars[key]
    if (value === null || value === undefined) {
      return missing === 'empty' ? '' : `{{${key}}}`
    }
    return String(value)
  })
}

function resolveSingleSpinPass(input: string, rng: () => number): { output: string; changed: boolean } {
  // Resolves the *first-level* occurrences like {a|b|c} without nesting.
  // We avoid heavy parsing: we only match blocks without braces inside.
  const pattern = /\{([^{}]*?\|[^{}]*?)\}/g

  let changed = false
  const output = input.replace(pattern, (_match, inner: string) => {
    const options = inner.split('|').map((s) => s.trim()).filter(Boolean)
    if (options.length === 0) return ''
    changed = true
    const idx = Math.floor(rng() * options.length)
    return options[Math.min(idx, options.length - 1)]
  })

  return { output, changed }
}

/**
 * Render a spintext template with variable replacement.
 * Supports:
 * - {a|b|c} choices
 * - {{var}} variables
 */
export function renderSpintext(template: string, vars: SpintextVariables = {}, options: SpintextOptions = {}): string {
  const rng = createRng(options.seed)
  const maxPasses = options.maxPasses ?? 10
  const missing = options.missingVariable ?? 'keep'

  // 1) Variables first, because many templates contain {{city}} inside spin blocks.
  let out = replaceVariables(template, vars, missing)

  // 2) Resolve spin blocks, multiple passes (safe guard) to handle repeated patterns.
  for (let pass = 0; pass < maxPasses; pass++) {
    const result = resolveSingleSpinPass(out, rng)
    out = result.output
    if (!result.changed) break
  }

  return out
}

/**
 * Convenience helper for stable content:
 * seed defaults to "${siteSlug}:${key}" kind of usage.
 */
export function renderSpintextStable(template: string, vars: SpintextVariables, seedKey: string): string {
  return renderSpintext(template, vars, { seed: seedKey, missingVariable: 'empty' })
}
