import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { ApiError, OpenAPI } from "./client"
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "./components/ui/sonner"
import "./index.css"
import { routeTree } from "./routeTree.gen"

const getApiBaseUrl = () => {
  const hostname = typeof window !== "undefined" ? window.location.hostname : ""

  if (hostname.includes("onrender.com")) {
    if (hostname.includes("-frontend")) {
      const base = hostname.split(".")[0]
      const backendBase = base.replace("-frontend", "-backend")
      return `https://${backendBase}.onrender.com`
    }
    return "https://apivault-backend.onrender.com"
  }

  if (
    hostname.endsWith("trycloudflare.com") ||
    hostname.endsWith("loca.lt") ||
    hostname.endsWith("lhr.life")
  ) {
    return "https://retention-stopping-programmers-new.trycloudflare.com"
  }

  const envUrl = import.meta.env.VITE_API_URL
  if (
    envUrl &&
    envUrl.trim() !== "" &&
    envUrl.includes(".") &&
    !envUrl.includes("localhost") &&
    !envUrl.includes("127.0.0.1")
  ) {
    let clean = envUrl.trim()
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`
    }
    return clean.endsWith("/") ? clean.slice(0, -1) : clean
  }

  return "http://localhost:8000"
}

OpenAPI.BASE = getApiBaseUrl()
OpenAPI.TOKEN = async () => {
  return localStorage.getItem("access_token") || ""
}

// Background warmup ping for Render free tier cold-start
if (typeof window !== "undefined") {
  fetch(`${getApiBaseUrl()}/api/v1/utils/health-check/`).catch(() => {})
}

const handleApiError = (error: Error) => {
  if (error instanceof ApiError && [401, 403, 404].includes(error.status)) {
    localStorage.removeItem("access_token")
    if (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/signup"
    ) {
      window.location.href = "/login"
    }
  }
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 4,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (error?.status && error.status >= 400 && error.status < 500) {
          return false
        }
        return failureCount < 2
      },
      retryDelay: 1000,
    },
  },
  queryCache: new QueryCache({
    onError: handleApiError,
  }),
  mutationCache: new MutationCache({
    onError: handleApiError,
  }),
})

const router = createRouter({ routeTree })
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors closeButton />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
