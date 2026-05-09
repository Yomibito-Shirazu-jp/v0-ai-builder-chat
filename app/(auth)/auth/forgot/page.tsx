"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Sparkles, Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const forgotSchema = z.object({
  email: z.string().email("メールアドレスの形式が正しくありません"),
})

type ForgotValues = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const t = useTranslations("auth")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (_values: ForgotValues) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSent(true)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">kanribu-ai</span>
          </div>
          <CardTitle className="text-2xl">{t("forgot.title")}</CardTitle>
          <CardDescription>{t("forgot.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isSent ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-6">
                {t("forgot.sent")}
              </p>
              <Link href="/auth/sign-in">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("forgot.backToSignIn")}
                </Button>
              </Link>
            </div>
          ) : (
            <>
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

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("processing")}
                      </>
                    ) : (
                      t("forgot.submit")
                    )}
                  </Button>
                </form>
              </Form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link href="/auth/sign-in" className="text-primary hover:underline">
                  <ArrowLeft className="inline h-3 w-3 mr-1" />
                  {t("forgot.backToSignIn")}
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
