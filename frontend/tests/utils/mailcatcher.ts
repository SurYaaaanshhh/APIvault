import type { APIRequestContext } from "@playwright/test"

type Email = {
  id: number
  recipients: string[]
  subject: string
}

async function findEmail({
  request,
  filter,
}: {
  request: APIRequestContext
  filter?: (email: Email) => boolean
}) {
  try {
    const host = process.env.MAILCATCHER_HOST || "http://localhost:1080"
    const response = await request.get(`${host}/messages`)

    if (!response.ok()) {
      return null
    }

    let emails = await response.json()

    if (filter) {
      emails = emails.filter(filter)
    }

    const email = emails[emails.length - 1]

    if (email) {
      return email as Email
    }
    return null
  } catch (_err) {
    return null
  }
}

export function findLastEmail({
  request,
  filter,
  timeout = 2000,
}: {
  request: APIRequestContext
  filter?: (email: Email) => boolean
  timeout?: number
}) {
  let attempts = 0
  const maxAttempts = Math.max(1, Math.floor(timeout / 200))

  const checkEmails = async () => {
    while (attempts < maxAttempts) {
      attempts++
      const emailData = await findEmail({ request, filter })

      if (emailData) {
        return emailData
      }
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
    return null
  }

  return checkEmails()
}
