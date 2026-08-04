import { Link } from "@tanstack/react-router"
import { ShieldCheck } from "lucide-react"

import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "full" | "icon" | "responsive"
  className?: string
  asLink?: boolean
}

export function Logo({
  variant = "full",
  className,
  asLink = true,
}: LogoProps) {
  const logoIcon = (
    <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm font-semibold shrink-0">
      <ShieldCheck className="size-5" />
    </div>
  )

  const logoText = (
    <span className="text-xl font-bold tracking-tight text-foreground font-sans">
      API<span className="text-emerald-500">vault</span>
    </span>
  )

  const content = (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      {variant === "responsive" && (
        <>
          {logoIcon}
          <span className="group-data-[collapsible=icon]:hidden">
            {logoText}
          </span>
        </>
      )}

      {variant === "full" && (
        <>
          {logoIcon}
          {logoText}
        </>
      )}

      {variant === "icon" && logoIcon}
    </div>
  )

  if (!asLink) {
    return content
  }

  return <Link to="/">{content}</Link>
}
