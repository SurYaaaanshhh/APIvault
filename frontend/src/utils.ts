import { AxiosError } from "axios"
import type { ApiError } from "./client"

function extractErrorMessage(err: any): string {
  if (!err) return "An unexpected error occurred."

  if (err instanceof AxiosError) {
    if (err.message === "Network Error") {
      return "Network Error: Server is waking up (Render cold start). Please wait ~30 seconds and try again."
    }
    return err.message
  }

  const errDetail = err.body?.detail ?? err.detail ?? err.message
  if (Array.isArray(errDetail) && errDetail.length > 0) {
    return errDetail[0]?.msg || String(errDetail[0]) || "Invalid input."
  }
  if (typeof errDetail === "string") {
    if (errDetail.includes("sqlalche.me") || errDetail.includes("psycopg")) {
      return "A database error occurred. Please try again."
    }
    return errDetail
  }
  if (err.message && typeof err.message === "string") {
    return err.message
  }

  return "Please check your email and password and try again."
}

export const handleError = function (
  this: (msg: string) => void,
  err: ApiError,
) {
  const errorMessage = extractErrorMessage(err)
  this(errorMessage)
}

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}
