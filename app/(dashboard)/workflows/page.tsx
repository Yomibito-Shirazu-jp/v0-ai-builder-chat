"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import {
  Search,
  Plus,
  MoreHorizontal,
  Workflow as WorkflowIcon,
  Play,
  Calendar,
  Zap,
  Hand,
  Pencil,
  Copy,
  Trash2,
  Check,
  X,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockWorkflows } from "@/lib/mock/data"

const triggerIcons: { [key: string]: React.ElementType } = {
  manual: Hand,
  "on-create": Plus,
  "on-update": Pencil,
  scheduled: Calendar,
  "via-mcp": Zap,
  "via-a2a": WorkflowIcon,
}

const triggerLabels: { [key: string]: string } = {
  manual: "手動",
  "on-create": "作成時",
  "on-update": "更新時",
  scheduled: "スケジュール",
  "via-mcp": "MCP経由",
  "via-a2a": "A2A経由",
}

function StatusIcon({ status }: { status: "success" | "failed" | "running" }) {
  if (status === "success") {
    return <Check className="h-4 w-4 text-green-500" />
  }
  if (status === "failed") {
    return <X className="h-4 w-4 text-red-500" />
  }
  return <AlertCircle className="h-4 w-4 text-yellow-500" />
}

export default function WorkflowsPage() {
  const t = useTranslations("workflows")
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [triggerFilter, setTriggerFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredWorkflows = mockWorkflows.filter((wf) => {
    if (search && !wf.name.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (triggerFilter !== "all" && wf.trigger !== triggerFilter) {
      return false
    }
    return true
  })

  if (mockWorkflows.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
        </div>
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-12 pb-12">
            <WorkflowIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">{t("empty.title")}</h2>
            <p className="text-sm text-muted-foreground mb-6">
              {t("empty.subtitle")}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={() => router.push("/builder")}>
                {t("empty.aiBuilder")}
              </Button>
              <Button variant="outline">{t("empty.manual")}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t("create")}
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select value={triggerFilter} onValueChange={setTriggerFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t("filter.trigger")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.all")}</SelectItem>
            <SelectItem value="manual">{t("trigger.manual")}</SelectItem>
            <SelectItem value="on-create">{t("trigger.onCreate")}</SelectItem>
            <SelectItem value="on-update">{t("trigger.onUpdate")}</SelectItem>
            <SelectItem value="scheduled">{t("trigger.scheduled")}</SelectItem>
            <SelectItem value="via-mcp">{t("trigger.viaMcp")}</SelectItem>
            <SelectItem value="via-a2a">{t("trigger.viaA2a")}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder={t("filter.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.all")}</SelectItem>
            <SelectItem value="enabled">{t("filter.enabled")}</SelectItem>
            <SelectItem value="disabled">{t("filter.disabled")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">{t("column.name")}</TableHead>
              <TableHead>{t("column.target")}</TableHead>
              <TableHead>{t("column.trigger")}</TableHead>
              <TableHead>{t("column.agent")}</TableHead>
              <TableHead>{t("column.a2a")}</TableHead>
              <TableHead>{t("column.lastRun")}</TableHead>
              <TableHead className="text-right">{t("column.monthlyRuns")}</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkflows.map((wf) => {
              const TriggerIcon = triggerIcons[wf.trigger] || WorkflowIcon
              return (
                <TableRow
                  key={wf.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/workflows/${wf.id}`)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{wf.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[280px]">
                        {wf.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{wf.targetEntityDisplay}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TriggerIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {triggerLabels[wf.trigger]}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={wf.agentMode === "trivium" ? "default" : "secondary"}
                    >
                      {wf.agentMode === "trivium" ? "TRIVIUM" : wf.agentModel}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Switch checked={wf.a2aExposed} />
                  </TableCell>
                  <TableCell>
                    {wf.lastRun && (
                      <div className="flex items-center gap-2">
                        <StatusIcon status={wf.lastRun.status} />
                        <span className="text-sm text-muted-foreground">
                          {wf.lastRun.time}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {wf.monthlyRuns}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 mr-2" />
                          {t("actions.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          {t("actions.duplicate")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Play className="h-4 w-4 mr-2" />
                          {t("actions.testRun")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t("actions.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
