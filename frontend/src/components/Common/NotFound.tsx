import { useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"

const NotFound = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate({ to: "/", replace: true })
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center flex-col p-4">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  )
}

export default NotFound
