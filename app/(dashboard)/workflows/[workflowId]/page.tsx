"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import {
  Play,
  MoreHorizontal,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { mockWorkflowDetail, mockRunWithTrivium, mockWorkflows } from "@/lib/mock/data"

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

function TriviumCard({
  title,
  model,
  tokensIn,
  tokensOut,
  cost,
  output,
  isHighlighted = false,
}: {
  title: string
  model: string
  tokensIn: number
  tokensOut: number
  cost: number
  output: string
  isHighlighted?: boolean
}) {
  const t = useTranslations("workflowDetail.trivium")
  const [showPrompt, setShowPrompt] = useState(false)

  return (
    <Card className={cn(isHighlighted && "border-primary border-2")}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <Badge variant="secondary">{model}</Badge>
          <span className="text-muted-foreground">¥{cost.toFixed(2)}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          in: {tokensIn.toLocaleString()}, out: {tokensOut.toLocaleString()}
        </div>
        <ScrollArea className="h-48 rounded border p-3 bg-muted/50">
          <div className="text-sm whitespace-pre-wrap">{output}</div>
        </ScrollArea>
        <Collapsible open={showPrompt} onOpenChange={setShowPrompt}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              {t("showPrompt")}
              <ChevronDown
                className={cn(
                  "h-3 w-3 ml-1 transition-transform",
                  showPrompt && "rotate-180"
                )}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 p-2 rounded bg-muted text-xs font-mono">
              {mockWorkflowDetail.agent.trivium?.grammatica.prompt}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

export default function WorkflowDetailPage() {
  const t = useTranslations("workflowDetail")
  const params = useParams()
  const workflowId = params.workflowId as string

  const workflow = mockWorkflows.find((w) => w.id === workflowId) || mockWorkflows[0]
  const detail = mockWorkflowDetail
  const run = mockRunWithTrivium

  const [selectedRun, setSelectedRun] = useState(run.id)

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/workflows">ワークフロー</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{detail.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{detail.name}</h1>
          <p className="text-muted-foreground mt-1">{detail.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Play className="h-4 w-4 mr-2" />
            {t("runNow")}
          </Button>
          <Button variant="outline">{t("edit")}</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("duplicate")}</DropdownMenuItem>
              <DropdownMenuItem>{t("disable")}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status row */}
      <div className="flex items-center gap-4 mb-6">
        <Badge variant="secondary">手動トリガー</Badge>
        <Badge>TRIVIUM</Badge>
        {detail.a2aExposed && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300">
              A2A 公開中
            </Badge>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
              {t("a2a.show")}
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="trivium" className="space-y-6">
        <TabsList>
          <TabsTrigger value="config">{t("tabs.config")}</TabsTrigger>
          <TabsTrigger value="history">{t("tabs.history")}</TabsTrigger>
          <TabsTrigger value="trivium">{t("tabs.trivium")}</TabsTrigger>
        </TabsList>

        {/* Config tab */}
        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("section.trigger")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">手動</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("section.agent")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">GRAMMATICA</Label>
                  <div className="mt-1">
                    <Badge>GPT-4</Badge>
                  </div>
                  <Textarea
                    className="mt-2 text-xs"
                    rows={3}
                    defaultValue={detail.agent.trivium?.grammatica.prompt}
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">LOGICA</Label>
                  <div className="mt-1">
                    <Badge>Claude Sonnet</Badge>
                  </div>
                  <Textarea
                    className="mt-2 text-xs"
                    rows={3}
                    defaultValue={detail.agent.trivium?.logica.prompt}
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">RHETORICA</Label>
                  <div className="mt-1">
                    <Badge>Gemini Pro</Badge>
                  </div>
                  <Textarea
                    className="mt-2 text-xs"
                    rows={3}
                    defaultValue={detail.agent.trivium?.rhetorica.prompt}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm">Max Tokens</Label>
                  <div className="mt-2 text-sm font-medium">
                    {detail.agent.maxTokens}
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Temperature</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[detail.agent.temperature]}
                      max={1}
                      step={0.1}
                      className="flex-1"
                      disabled
                    />
                    <span className="text-sm font-medium w-8">
                      {detail.agent.temperature}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Label className="text-sm">人間の最終承認を必須にする</Label>
                <Switch checked={detail.agent.trivium?.humanApprovalRequired} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History tab */}
        <TabsContent value="history">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("history.runId")}</TableHead>
                  <TableHead>{t("history.triggeredBy")}</TableHead>
                  <TableHead>{t("history.startedAt")}</TableHead>
                  <TableHead>{t("history.duration")}</TableHead>
                  <TableHead>{t("history.status")}</TableHead>
                  <TableHead className="text-right">{t("history.cost")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      {run.id.slice(0, 12)}
                    </code>
                  </TableCell>
                  <TableCell>{run.triggeredBy}</TableCell>
                  <TableCell>
                    {new Date(run.startedAt).toLocaleString("ja-JP")}
                  </TableCell>
                  <TableCell>{run.duration}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        run.status === "completed" &&
                          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      )}
                    >
                      {run.status === "completed" ? "完了" : run.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ¥{run.cost.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TRIVIUM trace tab */}
        <TabsContent value="trivium" className="space-y-6">
          <div className="flex items-center gap-4">
            <Label>実行を選択:</Label>
            <Select value={selectedRun} onValueChange={setSelectedRun}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={run.id}>
                  {run.id.slice(0, 12)} - {new Date(run.startedAt).toLocaleString("ja-JP")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Three columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <TriviumCard
              title={t("trivium.grammatica")}
              model={run.trivium!.grammatica.model}
              tokensIn={run.trivium!.grammatica.tokensIn}
              tokensOut={run.trivium!.grammatica.tokensOut}
              cost={run.trivium!.grammatica.cost}
              output={run.trivium!.grammatica.output}
            />
            <TriviumCard
              title={t("trivium.logica")}
              model={run.trivium!.logica.model}
              tokensIn={run.trivium!.logica.tokensIn}
              tokensOut={run.trivium!.logica.tokensOut}
              cost={run.trivium!.logica.cost}
              output={run.trivium!.logica.output}
            />
            <TriviumCard
              title={t("trivium.rhetorica")}
              model={run.trivium!.rhetorica.model}
              tokensIn={run.trivium!.rhetorica.tokensIn}
              tokensOut={run.trivium!.rhetorica.tokensOut}
              cost={run.trivium!.rhetorica.cost}
              output={run.trivium!.rhetorica.output}
              isHighlighted
            />
          </div>

          {/* Final conclusion */}
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-base">{t("trivium.final")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm mb-4">
                {run.trivium!.rhetorica.output}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-3 w-3 mr-1" />
                  {t("trivium.copy")}
                </Button>
                <Button variant="outline" size="sm">
                  {t("trivium.rerun")}
                </Button>
                <Button variant="outline" size="sm">
                  {t("trivium.recordIssue")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
