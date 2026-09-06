/**
 * Layered spam defenses for the public submission form. Deliberately no
 * CAPTCHA (friction for exactly the users we want to convert, needs a
 * third-party script, accessibility problems) — see docs/08-SUBMISSIONS.md.
 *
 * All three checks here are meant to fail quietly: a bot that trips one
 * should see the same success screen a real submitter would, so it never
 * learns which layer caught it or that anything was blocked at all.
 */

/** A real submitter never fills this — it's hidden from view entirely. */
export const HONEYPOT_FIELD_NAME = 'company_website'

const MIN_HUMAN_SUBMIT_MS = 2000

export function isSubmittedTooFast(mountedAtMs: number): boolean {
  return Date.now() - mountedAtMs < MIN_HUMAN_SUBMIT_MS
}

const URL_PATTERN = /https?:\/\/|www\.\S+\.\w{2,}/i
const SPAM_KEYWORDS = /\b(viagra|cialis|crypto|bitcoin|forex|casino|apostas? online|empr[eé]stimo f[aá]cil|ganhe dinheiro|renda extra garantida|seo backlink)\b/i

export interface SpamCheckInput {
  contactName: string
  entityName: string
  description: string
  honeypot?: string
  formMountedAtMs: number
}

/**
 * Content heuristics: a URL where a name should be is never legitimate: a
 * couple of links inside the free-text description might be (a business
 * owner pasting their own site), so that field tolerates one before it
 * counts as a marker. Honeypot and timing are checked by the caller
 * directly against their own fields since they aren't really "content".
 */
export function looksLikeSpamContent(input: SpamCheckInput): boolean {
  if (URL_PATTERN.test(input.contactName)) return true
  if (URL_PATTERN.test(input.entityName)) return true

  const urlMatches = input.description.match(/https?:\/\//gi)?.length ?? 0
  if (urlMatches > 1) return true

  if (SPAM_KEYWORDS.test(input.description)) return true

  return false
}

export function isLikelySpam(input: SpamCheckInput): boolean {
  if (input.honeypot) return true
  if (isSubmittedTooFast(input.formMountedAtMs)) return true
  return looksLikeSpamContent(input)
}
