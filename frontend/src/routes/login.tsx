import { zodResolver } from "@hookform/resolvers/zod"
import {
  createFileRoute,
  Link as RouterLink,
  redirect,
} from "@tanstack/react-router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import type { Body_login_login_access_token as AccessToken } from "@/client"
import { AuthLayout } from "@/components/Common/AuthLayout"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import { PasswordInput } from "@/components/ui/password-input"
import useAuth, { isLoggedIn } from "@/hooks/useAuth"

const formSchema = z.object({
  username: z.email(),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
}) satisfies z.ZodType<AccessToken>

type FormData = z.infer<typeof formSchema>

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
  head: () => ({
    meta: [
      {
        title: "Log In - APIvault",
      },
    ],
  }),
})

function Login() {
  const { loginMutation } = useAuth()
  const [debugError, setDebugError] = useState<string | null>(null)
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = (data: FormData) => {
    setDebugError(null)
    if (loginMutation.isPending) return
    loginMutation.mutate(data, {
      onError: (err: any) => {
        const msg = err?.body?.detail || err?.message || JSON.stringify(err)
        setDebugError(typeof msg === "string" ? msg : JSON.stringify(msg))
      },
    })
  }

  const handleDemoLogin = () => {
    setDebugError(null)
    form.setValue("username", "demo@apivault.com")
    form.setValue("password", "password123")
    loginMutation.mutate(
      {
        username: "demo@apivault.com",
        password: "password123",
      },
      {
        onError: (err: any) => {
          const msg = err?.body?.detail || err?.message || JSON.stringify(err)
          setDebugError(typeof msg === "string" ? msg : JSON.stringify(msg))
        },
      },
    )
  }

  return (
    <AuthLayout>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
          </div>

          <div className="grid gap-4">
            {debugError && (
              <div className="p-3 text-xs text-red-400 bg-red-950/40 border border-red-500/30 rounded-md font-mono break-all text-center">
                <strong>Diagnostic Error:</strong> {debugError}
              </div>
            )}

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="email-input"
                      placeholder="user@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <RouterLink
                      to="/recover-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </RouterLink>
                  </div>
                  <FormControl>
                    <PasswordInput
                      data-testid="password-input"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <LoadingButton type="submit" loading={loginMutation.isPending}>
              Log In
            </LoadingButton>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-1 border-primary/50 text-primary hover:bg-primary/10"
              onClick={handleDemoLogin}
              disabled={loginMutation.isPending}
            >
              ⚡ Quick Demo Login (1-Click)
            </Button>
          </div>

          <div className="text-center text-sm">
            Don't have an account yet?{" "}
            <RouterLink to="/signup" className="underline underline-offset-4">
              Sign up
            </RouterLink>
          </div>
        </form>
      </Form>
    </AuthLayout>
  )
}
