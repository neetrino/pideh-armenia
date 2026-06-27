import { localeFallbackOrder, type ContentLocale } from '@/lib/content-locale'

type MessageTree = Record<string, unknown>

function isMessageTree(value: unknown): value is MessageTree {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Deep-merge message trees; later sources override earlier keys. */
function mergeMessageTrees(base: MessageTree, override: MessageTree): MessageTree {
  const result: MessageTree = { ...base }

  for (const key of Object.keys(override)) {
    const baseValue = result[key]
    const overrideValue = override[key]

    if (isMessageTree(baseValue) && isMessageTree(overrideValue)) {
      result[key] = mergeMessageTrees(baseValue, overrideValue)
      continue
    }

    result[key] = overrideValue
  }

  return result
}

async function importMessages(locale: ContentLocale): Promise<MessageTree> {
  return (await import(`../messages/${locale}.json`)).default as MessageTree
}

/**
 * Load UI messages with fallback: missing keys come from other locales
 * (requested → hy → en → ru, later wins on conflict).
 */
export async function loadMessages(locale: ContentLocale): Promise<MessageTree> {
  const order = [...localeFallbackOrder(locale)].reverse()
  let merged: MessageTree = {}

  for (const loc of order) {
    merged = mergeMessageTrees(merged, await importMessages(loc))
  }

  return merged
}
