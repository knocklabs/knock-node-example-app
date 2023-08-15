import * as snippet from "@segment/snippet"
import Script from "next/script"

declare global {
  interface Window {
    analytics: {
      identify: (id: string, properties: any) => void
      track: (name: string, properties: any) => void
      page: (name: string, properties: any) => void
    }
  }
}

export function identify(user) {
  window?.analytics?.identify(user.id, {
    name: user.name,
    email: user.email,
    completed_sign_up_at: user.signedUpAt,
    created_at: user.insertedAt,
  })
}

export function track(eventName: string, attrs = {}) {
  window?.analytics?.track(eventName, attrs)
}

export function page(pageName: string, properties = {}) {
  window?.analytics?.page(pageName, properties)
}

export const SEGMENT_WRITE_KEY = process.env.SEGMENT_WRITE_KEY
export const ENABLE_SEGMENT = process.env.ENABLE_SEGMENT

function renderSnippet() {
  const opts = {
    apiKey: SEGMENT_WRITE_KEY,
    // note: the page option only covers SSR tracking.
    // Page.js is used to track other events using `window.analytics.page()`
    page: true,
  }

  if (process.env.NODE_ENV === "development") {
    return snippet.max(opts)
  }

  return snippet.min(opts)
}

export const Snippet = () => (
  <Script id="segment-script" dangerouslySetInnerHTML={{ __html: renderSnippet() }} />
)
