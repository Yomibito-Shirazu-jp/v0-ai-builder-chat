"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const signInSchema = z.object({
  email: z.string().email("メールアドレスの形式が正しくありません"),
  password: z.string().min(1, "パスワードを入力してください"),
})

type SignInValues = z.infer<typeof signInSchema>

export default function SignInPage() {
  const t = useTranslations("auth")
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: SignInValues) => {
    setIsLoading(true)
    setError(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock auth check
    if (values.email === "demo@example.com" && values.password === "password") {
      router.push("/")
    } else {
      setError(t("signIn.error.invalid"))
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left visual side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-slate-900 to-slate-950 items-center justify-center p-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4 text-balance">
            {t("tagline")}
          </h1>
          <p className="text-slate-400">{t("subtagline")}</p>
        </div>
      </div>

      {/* Right form side */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">kanribu-ai</span>
            </div>
            <CardTitle className="text-2xl">{t("signIn.title")}</CardTitle>
            <CardDescription>{t("signIn.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("signIn.email")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>{t("signIn.password")}</FormLabel>
                        <Link
                          href="/auth/forgot"
                          className="text-xs text-primary hover:underline"
                        >
                          {t("signIn.forgot")}
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("processing")}
                    </>
                  ) : (
                    t("signIn.submit")
                  )}
                </Button>
              </form>
            </Form>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                {t("signIn.or")}
              </span>
            </div>

            <Button variant="outline" className="w-full" disabled={isLoading}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t("signIn.google")}
            </Button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t("signIn.noAccount")}{" "}
              <Link href="/auth/sign-up" className="text-primary hover:underline">
                {t("signIn.signUpLink")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
