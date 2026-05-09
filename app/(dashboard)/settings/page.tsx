"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  AlertTriangle,
  Download,
} from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Bar, BarChart, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  mockTenant,
  mockMembers,
  mockApiKeys,
  mockMcpUsage,
  mockEntities,
  mockExposedAgents,
  mockBillingInvoices,
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

const tabs = [
  { id: "general", labelKey: "tabs.general" },
  { id: "members", labelKey: "tabs.members" },
  { id: "api", labelKey: "tabs.api" },
  { id: "billing", labelKey: "tabs.billing" },
  { id: "danger", labelKey: "tabs.dangerZone" },
]

const usageData = [
  { name: "MCP 呼び出し", used: 63421, quota: 100000 },
  { name: "TRIVIUM 実行", used: 142, quota: 500 },
  { name: "シート", used: 2, quota: 3 },
  { name: "ストレージ (GB)", used: 2.3, quota: 10 },
]

export default function SettingsPage() {
  const t = useTranslations("settings")
  const [activeTab, setActiveTab] = useState("api")
  const [deleteConfirm, setDeleteConfirm] = useState("")

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors text-left",
                  activeTab === tab.id
                    ? "bg-accent text-accent-foreground border-l-2 border-primary"
                    : "hover:bg-accent/50"
                )}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* General */}
          {activeTab === "general" && (
            <Card>
              <CardHeader>
                <CardTitle>{t("tabs.general")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("general.tenantName")}</Label>
                    <Input defaultValue={mockTenant.name} className="mt-1" />
                  </div>
                  <div>
                    <Label>{t("general.slug")}</Label>
                    <Input defaultValue={mockTenant.slug} className="mt-1" disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("general.slugHelp")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("general.locale")}</Label>
                    <Select defaultValue={mockTenant.locale}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ja">日本語</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t("general.timezone")}</Label>
                    <Select defaultValue={mockTenant.timezone}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="pt-4">
                  <Button>保存</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Members */}
          {activeTab === "members" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t("tabs.members")}</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      {t("members.invite")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("members.inviteModal.title")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>{t("members.inviteModal.email")}</Label>
                        <Input type="email" className="mt-1" />
                      </div>
                      <div>
                        <Label>{t("members.inviteModal.role")}</Label>
                        <Select defaultValue="editor">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">{t("members.role.admin")}</SelectItem>
                            <SelectItem value="editor">{t("members.role.editor")}</SelectItem>
                            <SelectItem value="viewer">{t("members.role.viewer")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>{t("members.inviteModal.message")}</Label>
                        <Textarea className="mt-1" rows={3} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button>{t("members.inviteModal.send")}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>メンバー</TableHead>
                      <TableHead>役割</TableHead>
                      <TableHead>参加日</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {member.avatarInitial}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue={member.role}>
                            <SelectTrigger className="w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">{t("members.role.admin")}</SelectItem>
                              <SelectItem value="editor">{t("members.role.editor")}</SelectItem>
                              <SelectItem value="viewer">{t("members.role.viewer")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{member.joinedAt}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* API & Integrations */}
          {activeTab === "api" && (
            <>
              {/* MCP Server */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t("api.mcp.title")}</CardTitle>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      稼働中
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Endpoint */}
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      {t("api.mcp.endpoint")}
                    </Label>
                    <div className="flex items-center gap-2 mt-1 p-2 rounded-md bg-muted font-mono text-sm">
                      <span className="truncate flex-1">
                        https://kanribu-ai.example.com/mcp/{mockTenant.slug}
                      </span>
                      <CopyButton text={`https://kanribu-ai.example.com/mcp/${mockTenant.slug}`} />
                    </div>
                  </div>

                  {/* Auth method */}
                  <div>
                    <Label className="text-sm mb-2 block">{t("api.mcp.auth")}</Label>
                    <RadioGroup defaultValue="apikey" className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="apikey" id="apikey" />
                        <Label htmlFor="apikey">{t("api.mcp.authApikey")}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="oauth" id="oauth" disabled />
                        <Label htmlFor="oauth" className="text-muted-foreground">
                          {t("api.mcp.authOauth")}
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {t("api.mcp.comingSoon")}
                          </Badge>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* API Keys */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">API キー</Label>
                      <Button variant="outline" size="sm">
                        <Plus className="h-3 w-3 mr-1" />
                        {t("api.mcp.keysCreate")}
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>名前</TableHead>
                          <TableHead>キー</TableHead>
                          <TableHead>作成日</TableHead>
                          <TableHead>最終使用</TableHead>
                          <TableHead className="w-12" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockApiKeys.map((key) => (
                          <TableRow key={key.id}>
                            <TableCell className="font-medium">{key.name}</TableCell>
                            <TableCell>
                              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                {key.prefix}
                              </code>
                            </TableCell>
                            <TableCell>{key.createdAt}</TableCell>
                            <TableCell>{key.lastUsed}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Separator />

                  {/* Exposed entities */}
                  <div>
                    <Label className="text-sm mb-3 block">{t("api.mcp.entities")}</Label>
                    <div className="space-y-3">
                      {mockEntities.map((entity) => (
                        <div
                          key={entity.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm">{entity.displayName}</div>
                            <Input
                              placeholder="説明を入力..."
                              defaultValue={entity.description}
                              className="mt-1 text-xs h-8"
                            />
                          </div>
                          <Switch checked={entity.exposed} className="ml-4" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Usage */}
                  <div>
                    <Label className="text-sm mb-3 block">{t("api.mcp.usage")}</Label>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockMcpUsage.history}>
                          <defs>
                            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="calls"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            fill="url(#colorUsage)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>
                          {t("api.mcp.usageThisMonth", {
                            used: mockMcpUsage.thisMonth.toLocaleString(),
                            quota: mockMcpUsage.quota.toLocaleString(),
                          })}
                        </span>
                        <span className="text-muted-foreground">
                          前月: {mockMcpUsage.lastMonth.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={(mockMcpUsage.thisMonth / mockMcpUsage.quota) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* A2A Agents */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("api.a2a.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {mockExposedAgents.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {t("api.a2a.empty")}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {mockExposedAgents.map((agent) => (
                        <div
                          key={agent.workflowId}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div>
                            <div className="font-medium text-sm">{agent.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="text-xs bg-muted px-1.5 py-0.5 rounded truncate max-w-[400px]">
                                {agent.cardUrl}
                              </code>
                              <CopyButton text={agent.cardUrl} />
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            {t("api.a2a.showCard")}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Billing */}
          {activeTab === "billing" && (
            <>
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>Starter プラン</CardTitle>
                  <CardDescription>¥3,000 / 月</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1 mb-4">
                    <li>• 1 テナント</li>
                    <li>• 100,000 MCP 呼び出し / 月</li>
                    <li>• 3 シート</li>
                    <li>• コミュニティサポート</li>
                  </ul>
                  <Button variant="outline">{t("billing.changePlan")}</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("billing.usage")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {usageData.map((item) => (
                      <div key={item.name}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{item.name}</span>
                          <span>
                            {item.used.toLocaleString()} / {item.quota.toLocaleString()}
                          </span>
                        </div>
                        <Progress
                          value={(item.used / item.quota) * 100}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-medium mt-6">
                    {t("billing.estimated", { amount: "3,000" })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{t("billing.history")}</CardTitle>
                  <Button>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t("billing.portal")}
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>日付</TableHead>
                        <TableHead>金額</TableHead>
                        <TableHead>ステータス</TableHead>
                        <TableHead className="w-24" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBillingInvoices.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell>{inv.date}</TableCell>
                          <TableCell>¥{inv.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              className={cn(
                                inv.status === "paid" &&
                                  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              )}
                            >
                              {inv.status === "paid" ? "支払済" : inv.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              PDF
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          {/* Danger Zone */}
          {activeTab === "danger" && (
            <>
              <Card className="border-destructive/40">
                <CardHeader>
                  <CardTitle>{t("danger.export.title")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>{t("danger.export.includeMcp")}</Label>
                    <Switch />
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    {t("danger.export.button")}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-destructive/40">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    {t("danger.delete.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-destructive">
                    {t("danger.delete.warning")}
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">{t("danger.delete.button")}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("danger.delete.title")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("danger.delete.confirm", { slug: mockTenant.slug })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <Input
                        placeholder={mockTenant.slug}
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                      />
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                          disabled={deleteConfirm !== mockTenant.slug}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {t("danger.delete.button")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
