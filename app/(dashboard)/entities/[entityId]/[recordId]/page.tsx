"use client"

import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { use, useState } from "react"
import {
  MoreHorizontal,
  Play,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  mockEntities,
  mockProjects,
  mockActivityLog,
  mockRelatedRecords,
  mockWorkflows,
} from "@/lib/mock/data"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copy}>
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
    </Button>
  )
}

function formatValue(value: unknown, type: string): string {
  if (value === null || value === undefined) return "-"
  if (type === "checkbox") return value ? "はい" : "いいえ"
  if (type === "number") return (value as number).toLocaleString()
  if (type === "date" || type === "datetime") {
    return new Date(value as string).toLocaleDateString("ja-JP")
  }
  if (type === "reference" && typeof value === "object") {
    return (value as { display: string }).display
  }
  return String(value)
}

export default function RecordDetailPage() {
  const t = useTranslations("record")
  const router = useRouter()
  const params = useParams()
  const entityId = params.entityId as string
  const recordId = params.recordId as string

  const entity = mockEntities.find((e) => e.id === entityId)
  const record = mockProjects.find((r) => r.id === recordId) || mockProjects[0]

  if (!entity || !record) {
    return <div className="p-6">Record not found</div>
  }

  const primaryField = entity.fields[0]
  const recordTitle = String(record.data[primaryField.id] || record.id)

  const basicFields = entity.fields.slice(0, 3)
  const detailFields = entity.fields.slice(3)

  const entityWorkflows = mockWorkflows.filter(
    (w) => w.targetEntity === entityId || w.targetEntity === null
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <Breadcrumb>
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
              <BreadcrumbPage>{recordTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-start justify-between mt-4">
          <div>
            <h1 className="text-2xl font-semibold">{recordTitle}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("lastUpdated", {
                user: record.updatedBy.name,
                time: "2時間前",
              })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  {t("runWorkflow")}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {entityWorkflows.length === 0 ? (
                  <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                    {t("workflows.empty")}
                  </div>
                ) : (
                  entityWorkflows.map((wf) => (
                    <DropdownMenuItem key={wf.id}>{wf.name}</DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>{t("menu.duplicate")}</DropdownMenuItem>
                <DropdownMenuItem>{t("menu.export")}</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  {t("menu.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("section.basic")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {basicFields.map((field) => (
                <div key={field.id} className="flex items-start gap-4">
                  <span className="w-32 text-sm text-muted-foreground flex-shrink-0">
                    {field.displayName}
                  </span>
                  <span className="text-sm flex-1">
                    {formatValue(record.data[field.id], field.type)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Details */}
          {detailFields.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("section.details")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {detailFields.map((field) => (
                  <div key={field.id} className="flex items-start gap-4">
                    <span className="w-32 text-sm text-muted-foreground flex-shrink-0">
                      {field.displayName}
                    </span>
                    <span className="text-sm flex-1">
                      {formatValue(record.data[field.id], field.type)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Activity log */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("activity.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivityLog.map((item, i) => (
                  <Collapsible key={item.id}>
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {item.avatarInitial}
                          </AvatarFallback>
                        </Avatar>
                        {i < mockActivityLog.length - 1 && (
                          <div className="absolute left-4 top-8 w-px h-6 bg-border" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.user}</span>
                          <Badge variant="secondary" className="text-xs">
                            {item.action}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {item.timeRelative}
                          </span>
                        </div>
                        {Object.keys(item.diff || {}).length > 0 && (
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 mt-1"
                            >
                              <ChevronRight className="h-3 w-3 mr-1" />
                              変更内容を表示
                            </Button>
                          </CollapsibleTrigger>
                        )}
                        <CollapsibleContent>
                          <div className="mt-2 p-2 rounded bg-muted text-xs font-mono space-y-1">
                            {Object.entries(item.diff || {}).map(([field, change]) => (
                              <div key={field}>
                                <span className="text-muted-foreground">{field}:</span>{" "}
                                <span className="text-red-500 line-through">
                                  {(change as { before: string }).before}
                                </span>{" "}
                                →{" "}
                                <span className="text-green-500">
                                  {(change as { after: string }).after}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </div>
                    </div>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Related records */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("related.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(mockRelatedRecords).length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("related.empty")}</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(mockRelatedRecords).map(([entityKey, records]) => (
                    <div key={entityKey}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          請求書 ({records.length})
                        </span>
                        <Button variant="link" size="sm" className="h-auto p-0">
                          {t("related.viewAll")}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {records.map((r) => (
                          <div
                            key={r.id}
                            className="p-2 rounded border text-sm cursor-pointer hover:bg-accent/50"
                            onClick={() => router.push(`/entities/invoices/${r.id}`)}
                          >
                            <div className="font-medium">{r.invoice_number}</div>
                            <div className="text-muted-foreground">
                              ¥{r.amount.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick info */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("info.id")}</span>
                <div className="flex items-center gap-1">
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                    {record.id.slice(0, 8)}...
                  </code>
                  <CopyButton text={record.id} />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("info.createdAt")}
                </span>
                <span className="text-sm">
                  {new Date(record.createdAt).toLocaleDateString("ja-JP")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("info.createdBy")}
                </span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[10px]">
                      {record.createdBy.avatarInitial}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{record.createdBy.name}</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("info.mcpExposed")}
                </span>
                <Switch checked={record.mcpExposed} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
