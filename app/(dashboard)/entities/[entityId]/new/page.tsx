"use client"

import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"
import { mockEntities, mockCustomers } from "@/lib/mock/data"

export default function RecordNewPage() {
  const t = useTranslations("record.form")
  const router = useRouter()
  const params = useParams()
  const entityId = params.entityId as string

  const entity = mockEntities.find((e) => e.id === entityId)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  // Dynamic schema based on entity fields
  const schemaShape: { [key: string]: z.ZodTypeAny } = {}
  entity?.fields.forEach((field) => {
    let schema: z.ZodTypeAny = z.string()
    if (field.type === "number") {
      schema = z.coerce.number().optional()
    } else if (field.type === "checkbox") {
      schema = z.boolean().optional()
    } else if (field.type === "date" || field.type === "datetime") {
      schema = z.date().optional()
    } else if (field.required) {
      schema = z.string().min(1, t("required"))
    } else {
      schema = z.string().optional()
    }
    schemaShape[field.id] = schema
  })
  const formSchema = z.object(schemaShape)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  // Auto-save draft
  useEffect(() => {
    const timer = setInterval(() => {
      const values = form.getValues()
      if (Object.values(values).some((v) => v !== undefined && v !== "")) {
        localStorage.setItem(
          `kanribu-draft-${entityId}-new`,
          JSON.stringify(values)
        )
        setSavedAt(new Date().toLocaleTimeString("ja-JP"))
      }
    }, 5000)
    return () => clearInterval(timer)
  }, [form, entityId])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("[v0] Form submitted:", values)
    localStorage.removeItem(`kanribu-draft-${entityId}-new`)
    router.push(`/entities?entity=${entityId}`)
  }

  if (!entity) {
    return <div className="p-6">Entity not found</div>
  }

  const basicFields = entity.fields.slice(0, 3)
  const detailFields = entity.fields.slice(3)

  const renderField = (field: (typeof entity.fields)[0]) => {
    return (
      <FormField
        key={field.id}
        control={form.control}
        name={field.id}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>
              {field.displayName}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            <FormControl>
              {field.type === "text" ? (
                <Input {...formField} value={formField.value || ""} />
              ) : field.type === "long-text" ? (
                <Textarea {...formField} rows={4} value={formField.value || ""} />
              ) : field.type === "number" ? (
                <Input
                  type="number"
                  {...formField}
                  value={formField.value || ""}
                  onChange={(e) => formField.onChange(e.target.valueAsNumber)}
                />
              ) : field.type === "select" ? (
                <Select
                  value={formField.value}
                  onValueChange={formField.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "reference" ? (
                <Select
                  value={formField.value}
                  onValueChange={formField.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCustomers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {String(c.data.company_name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "date" || field.type === "datetime" ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formField.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formField.value
                        ? format(formField.value, "yyyy/MM/dd")
                        : "日付を選択"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formField.value}
                      onSelect={formField.onChange}
                    />
                  </PopoverContent>
                </Popover>
              ) : field.type === "checkbox" ? (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                  />
                  <span className="text-sm text-muted-foreground">
                    {field.displayName}
                  </span>
                </div>
              ) : (
                <Input {...formField} value={formField.value || ""} />
              )}
            </FormControl>
            {field.helpText && (
              <FormDescription>{field.helpText}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/entities">テーブル</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/entities?entity=${entityId}`}>
              {entity.displayName}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>新規作成</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          {t("create.title", { entity: entity.displayName })}
        </h1>
        {savedAt && (
          <span className="text-sm text-muted-foreground">
            {t("draft.saved", { time: savedAt })}
          </span>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic info section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {basicFields.map(renderField)}
            </CardContent>
          </Card>

          {/* Detail section */}
          {detailFields.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">詳細</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {detailFields.map(renderField)}
              </CardContent>
            </Card>
          )}

          {/* Action bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" variant="outline">
              {t("saveAndContinue")}
            </Button>
            <Button type="submit">{t("save")}</Button>
          </div>
        </form>
      </Form>

      {/* AI Assist panel placeholder */}
      <Card className="fixed bottom-6 right-6 w-80 hidden lg:block">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI アシスタント
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            フォーム入力中に AI がサポートします。
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3"
            disabled
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            提案を取得
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
