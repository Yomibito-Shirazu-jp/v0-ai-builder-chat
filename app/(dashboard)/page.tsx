"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Database,
  FileText,
  Workflow,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Send,
} from "lucide-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { mockDashboardData, mockRecentActivity } from "@/lib/mock/data"

function StatCard({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: React.ElementType
  label: string
  value: number
  delta: number
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold mt-1">{value.toLocaleString()}</p>
          <p
            className={cn(
              "text-sm mt-1",
              delta >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}
          >
            {delta >= 0 ? "+" : ""}
            {delta} (前月比)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="ghost" size="icon" onClick={copy} className="h-8 w-8">
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}

export default function DashboardPage() {
  const t = useTranslations("dashboard")
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const { stats, mcp } = mockDashboardData

  const handlePromptSubmit = () => {
    if (prompt.trim()) {
      router.push(`/builder?prompt=${encodeURIComponent(prompt)}`)
    }
  }

  const quickPrompts = [
    t("builder.prompts.addDueDate"),
    t("builder.prompts.createResearchAgent"),
    t("builder.prompts.aggregateSales"),
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-balance">
          {t("welcome", { tenantName: mockDashboardData.tenantName })}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("newChanges", { n: mockDashboardData.newChangesCount })}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={Database}
          label={t("stats.entities")}
          value={stats.entities.value}
          delta={stats.entities.delta}
        />
        <StatCard
          icon={FileText}
          label={t("stats.records")}
          value={stats.recordsThisMonth.value}
          delta={stats.recordsThisMonth.delta}
        />
        <StatCard
          icon={Workflow}
          label={t("stats.workflows")}
          value={stats.workflowRunsThisMonth.value}
          delta={stats.workflowRunsThisMonth.delta}
        />
      </div>

      {/* MCP Server status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{t("mcp.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Endpoints */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {t("mcp.status.running")}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("mcp.endpoint")}</p>
                  <div className="flex items-center gap-2 p-2 rounded-md bg-muted font-mono text-sm">
                    <span className="truncate flex-1">{mcp.endpoint}</span>
                    <CopyButton text={mcp.endpoint} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("mcp.a2aEndpoint")}</p>
                  <div className="flex items-center gap-2 p-2 rounded-md bg-muted font-mono text-sm">
                    <span className="truncate flex-1">{mcp.a2aEndpoint}</span>
                    <CopyButton text={mcp.a2aEndpoint} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Chart */}
            <div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mcp.callHistory}>
                    <defs>
                      <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="calls"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#colorCalls)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {t("mcp.usage", {
                    used: mcp.used.toLocaleString(),
                    quota: mcp.quota.toLocaleString(),
                  })}
                </p>
                <Progress value={(mcp.used / mcp.quota) * 100} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two column section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{t("activity.title")}</CardTitle>
            <Link
              href="/activity"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              {t("activity.viewAll")}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                      {item.avatarInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{item.user}</span>
                      {" が "}
                      <span className="text-muted-foreground">{item.entity}</span>
                      {" の "}
                      <span className="font-medium">{item.recordTitle}</span>
                      {" を "}
                      <Badge
                        variant={
                          item.action === "作成"
                            ? "default"
                            : item.action === "更新"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {item.action}
                      </Badge>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Builder quick prompt */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("builder.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickPrompts.map((p, i) => (
              <Button
                key={i}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => router.push(`/builder?prompt=${encodeURIComponent(p)}`)}
              >
                {p}
              </Button>
            ))}
            <div className="flex gap-2 mt-4">
              <Input
                placeholder={t("builder.placeholder")}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePromptSubmit()}
              />
              <Button onClick={handlePromptSubmit} disabled={!prompt.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating AI button */}
      <Link href="/builder">
        <Button
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        >
          <Sparkles className="h-6 w-6" />
          <span className="sr-only">AI Builder</span>
        </Button>
      </Link>
    </div>
  )
}
