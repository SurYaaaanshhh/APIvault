import { useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"

const ErrorComponent = () => {
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem("access_token")
    navigate({ to: "/login", replace: true })
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center flex-col p-4">
      <p className="text-muted-foreground">Refreshing session...</p>
    </div>
  )
}

export default ErrorComponent
