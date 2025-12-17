function seededRandom(seed: number): () => number {
  return function () {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

export function parseSpintax(text: string, seed: string): string {
  if (!text) return ""

  const random = seededRandom(hashString(seed))
  let result = text

  // Keep parsing until no more {options|like|this} remain
  const pattern = /\{([^{}]+)\}/g
  let iterations = 0
  const maxIterations = 100 // Prevent infinite loops

  while (result.includes("{") && result.includes("|") && iterations < maxIterations) {
    result = result.replace(pattern, (match, group) => {
      const options = String(group)
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean)

      if (options.length === 0) return match

      const selectedIndex = Math.floor(random() * options.length)
      return options[selectedIndex] ?? ""
    })
    iterations++
  }

  return result
}

export function replaceVariables(text: string, variables: Record<string, string>): string {
  if (!text) return ""

  let result = text
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}|\\{${key}\\}`, "gi")
    result = result.replace(regex, value || "")
  }
  return result
}

export function processContent(spintaxText: string, domain: string, variables: Record<string, string>): string {
  // First replace variables like {{city}}, {{business_name}}
  let result = replaceVariables(spintaxText, variables)
  // Then parse spintax {option1|option2}
  result = parseSpintax(result, domain)
  return result
}
