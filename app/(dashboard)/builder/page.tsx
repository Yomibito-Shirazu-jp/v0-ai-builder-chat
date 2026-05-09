"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import {
  Plus,
  MoreHorizontal,
  Settings,
  Sparkles,
  Send,
  Paperclip,
  Mic,
  GitBranch,
  ChevronDown,
  ChevronRight,
  Wrench,
  Check,
  X,
  Search,
  Pin,
  PinOff,
  Copy,
  HelpCircle,
  Command,
  Table2,
  Workflow,
  Play,
  MessageSquare,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import {
  mockConversation,
  mockConversationHistory,
  mockConversationWithTrivium,
  mockUser,
  mockEntities,
} from "@/lib/mock/data"
import type { MessageContent, ConversationMessage, TriviumTrace } from "@/lib/types"

// ======== Streaming Text Component ========
function StreamingText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (isComplete) return
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        setIsComplete(true)
        onComplete?.()
      }
    }, 15)
    return () => clearInterval(interval)
  }, [text, onComplete, isComplete])

  return <span>{displayedText}{!isComplete && <span className="animate-pulse">▋</span>}</span>
}

// ======== Typing Dots ========
function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  )
}

// ======== Code Block Component ========
function CodeBlock({ code, language }: { code: string; language: string }) {
  const t = useTranslations("builder.code")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-3 rounded-md border bg-muted/50 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <Button variant="ghost" size="sm" className="h-6 px-2" onClick={handleCopy}>
          <Copy className="h-3 w-3 mr-1" />
          <span className="text-xs">{copied ? t("copied") : t("copy")}</span>
        </Button>
      </div>
      <pre className="p-3 overflow-x-auto text-xs font-mono">
        <code>{code}</code>
      </pre>
    </div>
  )
}

// ======== TRIVIUM Trace Card ========
function TriviumTraceCard({ trace }: { trace: TriviumTrace }) {
  const t = useTranslations("builder.trivium")
  const [expanded, setExpanded] = useState(false)

  const layers = [
    { key: "grammatica", data: trace.grammatica, color: "text-blue-600 dark:text-blue-400" },
    { key: "logica", data: trace.logica, color: "text-amber-600 dark:text-amber-400" },
    { key: "rhetorica", data: trace.rhetorica, color: "text-emerald-600 dark:text-emerald-400" },
  ] as const

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="my-2 w-full justify-between border-primary/30">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium">TRIVIUM 三層合議</span>
          </div>
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="border-primary/30 mt-2">
          <CardContent className="pt-4">
            <div className="grid grid-cols-3 gap-4">
              {layers.map(({ key, data, color }) => (
                <div key={key} className="space-y-2">
                  <div className={cn("font-semibold text-sm", color)}>
                    {t(key as "grammatica" | "logica" | "rhetorica")}
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted/50 p-2 rounded max-h-48 overflow-y-auto">
                    {data.output}
                  </div>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <div>{data.model}</div>
                    <div>{data.tokensIn + data.tokensOut} {t("tokens")}</div>
                    <div>${data.cost.toFixed(2)} {t("cost")}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="font-semibold text-sm mb-2">{t("final")}</div>
              <div className="text-sm font-medium whitespace-pre-wrap">
                {trace.rhetorica.output.split("\n").slice(0, 3).join("\n")}
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}

// ======== Proposed Change Card ========
function ProposedChangeCard({
  change,
  onApply,
  onReject,
  onPreview,
}: {
  change: Extract<MessageContent, { type: "proposed_change" }>
  onApply: () => void
  onReject: () => void
  onPreview: () => void
}) {
  const t = useTranslations("builder.proposedChange")
  return (
    <Card className="border-primary/40 my-3">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{t("title")}</span>
          <Badge variant="secondary" className="text-xs">
            {change.scope}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p className="text-sm mb-3">{change.description}</p>
        <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-1">
          <div className="text-red-500">- {change.diff.before}</div>
          <div className="text-green-500">+ {change.diff.after}</div>
        </div>
        {change.status === "pending" && (
          <div className="flex items-center gap-2 mt-3">
            <Button size="sm" onClick={onApply}>
              <Check className="h-3 w-3 mr-1" />
              {t("apply")}
            </Button>
            <Button size="sm" variant="outline" onClick={onPreview}>
              <Eye className="h-3 w-3 mr-1" />
              {t("preview")}
            </Button>
            <Button size="sm" variant="ghost" onClick={onReject}>
              <X className="h-3 w-3 mr-1" />
              {t("reject")}
            </Button>
          </div>
        )}
        {change.status === "applied" && (
          <Badge className="mt-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            適用済み
          </Badge>
        )}
        {change.status === "rejected" && (
          <Badge variant="secondary" className="mt-3">
            却下
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

// ======== Tool Call Card ========
function ToolCallCard({
  call,
}: {
  call: Extract<MessageContent, { type: "tool_call" }>
}) {
  const [expanded, setExpanded] = useState(false)
  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 my-1 font-mono text-xs"
        >
          <Wrench className="h-3 w-3 mr-1" />
          {call.name}()
          {expanded ? (
            <ChevronDown className="h-3 w-3 ml-1" />
          ) : (
            <ChevronRight className="h-3 w-3 ml-1" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="bg-muted rounded-md p-3 font-mono text-xs my-2 space-y-2">
          <div>
            <span className="text-muted-foreground">Input:</span>
            <pre className="mt-1">{JSON.stringify(call.input, null, 2)}</pre>
          </div>
          <div>
            <span className="text-muted-foreground">Output:</span>
            <pre className="mt-1">{JSON.stringify(call.output, null, 2)}</pre>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// ======== Message Bubble ========
function MessageBubble({
  message,
  onApplyChange,
  onRejectChange,
  onPreviewChange,
  isStreaming = false,
}: {
  message: ConversationMessage
  onApplyChange: (index: number) => void
  onRejectChange: (index: number) => void
  onPreviewChange: (index: number) => void
  isStreaming?: boolean
}) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn("h-8 w-8 flex-shrink-0", isUser && "order-1")}>
        <AvatarFallback
          className={cn(
            "text-xs",
            isUser
              ? "bg-secondary text-secondary-foreground"
              : "bg-primary text-primary-foreground"
          )}
        >
          {isUser ? mockUser.avatarInitial : <Sparkles className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "space-y-1",
          isUser ? "max-w-[70%]" : "max-w-[80%]"
        )}
      >
        {message.content.map((content, i) => {
          if (content.type === "text") {
            return (
              <div
                key={i}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm",
                  isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {isStreaming && i === message.content.length - 1 ? (
                  <StreamingText text={content.text} />
                ) : (
                  content.text
                )}
              </div>
            )
          }
          if (content.type === "proposed_change") {
            return (
              <ProposedChangeCard
                key={i}
                change={content}
                onApply={() => onApplyChange(i)}
                onReject={() => onRejectChange(i)}
                onPreview={() => onPreviewChange(i)}
              />
            )
          }
          if (content.type === "tool_call") {
            return <ToolCallCard key={i} call={content} />
          }
          if (content.type === "trivium_trace") {
            return <TriviumTraceCard key={i} trace={content.trace} />
          }
          if (content.type === "code") {
            return <CodeBlock key={i} code={content.code} language={content.language} />
          }
          return null
        })}
      </div>
    </div>
  )
}

// ======== Empty State ========
function EmptyState({ onPromptSelect }: { onPromptSelect: (prompt: string) => void }) {
  const t = useTranslations("builder.empty")

  const prompts = [
    { key: "addField", icon: Table2 },
    { key: "createWorkflow", icon: Workflow },
    { key: "aggregateView", icon: MessageSquare },
  ] as const

  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <Sparkles className="h-12 w-12 text-primary mb-4" />
      <h2 className="text-xl font-semibold mb-8">{t("title")}</h2>
      
      <div className="w-full max-w-lg space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">{t("recentTables")}</h3>
          <div className="flex flex-wrap gap-2">
            {mockEntities.slice(0, 3).map((entity) => (
              <Button
                key={entity.id}
                variant="outline"
                size="sm"
                onClick={() => onPromptSelect(`@${entity.displayName} `)}
              >
                <Table2 className="h-3 w-3 mr-1" />
                {entity.displayName}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">{t("faq")}</h3>
          <div className="space-y-2">
            {prompts.map(({ key, icon: Icon }) => (
              <Button
                key={key}
                variant="ghost"
                className="w-full justify-start h-auto py-3 px-4"
                onClick={() => onPromptSelect(t(`prompts.${key}` as `prompts.${typeof key}`))}
              >
                <Icon className="h-4 w-4 mr-3 text-primary" />
                <span className="text-sm">{t(`prompts.${key}` as `prompts.${typeof key}`)}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ======== Preview Sheet ========
function PreviewSheet({
  open,
  onOpenChange,
  change,
  onApply,
  onReject,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  change: Extract<MessageContent, { type: "proposed_change" }> | null
  onApply: () => void
  onReject: () => void
}) {
  const t = useTranslations("builder.pending")
  const tChange = useTranslations("builder.proposedChange")

  if (!change) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            {tChange("title")}
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">{t("scope")}</div>
            <Badge variant="secondary">{change.scope}</Badge>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">{t("description")}</div>
            <p className="text-sm">{change.description}</p>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-2">Diff</div>
            <div className="bg-muted rounded-md p-4 font-mono text-sm space-y-2">
              <div className="text-red-500 bg-red-500/10 px-2 py-1 rounded">- {change.diff.before}</div>
              <div className="text-green-500 bg-green-500/10 px-2 py-1 rounded">+ {change.diff.after}</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">{t("impact")}</div>
            <div className="text-sm text-muted-foreground">
              {change.scope.includes("entities") ? "テーブル構造に影響" : "ワークフロー設定に影響"}
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="ghost" onClick={onReject}>
            <X className="h-4 w-4 mr-1" />
            {tChange("reject")}
          </Button>
          <Button onClick={onApply}>
            <Check className="h-4 w-4 mr-1" />
            {tChange("apply")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// ======== Shortcuts Dialog ========
function ShortcutsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const t = useTranslations("builder.shortcuts")

  const shortcuts = [
    { keys: ["⌘", "Enter"], action: t("send") },
    { keys: ["⌘", "/"], action: t("newConversation") },
    { keys: ["⌘", "K"], action: t("search") },
    { keys: ["Esc"], action: t("close") },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {shortcuts.map((shortcut, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{shortcut.action}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, j) => (
                  <kbd
                    key={j}
                    className="px-2 py-1 text-xs font-mono bg-muted rounded border"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ======== Main Page ========
export default function BuilderPage() {
  const t = useTranslations("builder")
  const tCommon = useTranslations("common")
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get("prompt") || ""

  // State
  const [messages, setMessages] = useState(mockConversation.messages)
  const [input, setInput] = useState(initialPrompt)
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [mode, setMode] = useState<"sonnet" | "trivium">("sonnet")
  const [activeConversation, setActiveConversation] = useState(mockConversation.id)
  const [historySearch, setHistorySearch] = useState("")
  const [pinnedConversations, setPinnedConversations] = useState<string[]>(
    mockConversationHistory.filter(c => c.pinned).map(c => c.id)
  )
  
  // Preview Sheet
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewChange, setPreviewChange] = useState<{ change: Extract<MessageContent, { type: "proposed_change" }>; mi: number; ci: number } | null>(null)

  // Confirm Dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  // Shortcuts Dialog
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  // Command Palette
  const [commandOpen, setCommandOpen] = useState(false)

  // Mention/Slash Popover
  const [mentionOpen, setMentionOpen] = useState(false)
  const [slashOpen, setSlashOpen] = useState(false)
  const [popoverAnchor, setPopoverAnchor] = useState<{ top: number; left: number } | null>(null)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Computed
  const pendingChanges = useMemo(() => 
    messages
      .flatMap((m) => m.content)
      .filter(
        (c): c is Extract<MessageContent, { type: "proposed_change" }> =>
          c.type === "proposed_change" && c.status === "pending"
      ),
    [messages]
  )

  const filteredHistory = useMemo(() => {
    const query = historySearch.toLowerCase()
    return mockConversationHistory.filter(
      (c) => c.title.toLowerCase().includes(query)
    )
  }, [historySearch])

  const groupedHistory = useMemo(() => {
    const pinned = filteredHistory.filter((c) => pinnedConversations.includes(c.id))
    const unpinned = filteredHistory.filter((c) => !pinnedConversations.includes(c.id))
    return {
      pinned,
      今日: unpinned.filter((c) => c.group === "今日"),
      今週: unpinned.filter((c) => c.group === "今週"),
      今週より前: unpinned.filter((c) => c.group === "今週より前"),
    }
  }, [filteredHistory, pinnedConversations])

  // Effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMentionOpen(false)
        setSlashOpen(false)
        setPreviewOpen(false)
        setShortcutsOpen(false)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault()
        handleNewConversation()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandOpen(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      const lineHeight = 24
      const maxLines = 8
      const maxHeight = lineHeight * maxLines
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
    }
  }, [])

  useEffect(() => {
    adjustTextareaHeight()
  }, [input, adjustTextareaHeight])

  // Handlers
  const handleNewConversation = () => {
    setMessages([])
    setActiveConversation("")
    setInput("")
  }

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return

    const newUserMessage: ConversationMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: [{ type: "text", text: input }],
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInput("")
    setIsLoading(true)

    // Simulate streaming AI response
    setTimeout(() => {
      setIsLoading(false)
      setIsStreaming(true)
      
      const aiResponse: ConversationMessage = mode === "trivium"
        ? mockConversationWithTrivium.messages[1]
        : {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            content: [
              {
                type: "text",
                text: "承知しました。ご要望を確認しています...",
              },
            ],
            timestamp: new Date().toISOString(),
          }
      
      setMessages((prev) => [...prev, aiResponse])
      
      setTimeout(() => {
        setIsStreaming(false)
      }, 1000)
    }, 1500)
  }, [input, isLoading, mode])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setInput(value)

    // Check for @ mention
    const lastAtIndex = value.lastIndexOf("@")
    if (lastAtIndex !== -1 && lastAtIndex === value.length - 1) {
      setMentionOpen(true)
      setSlashOpen(false)
    } else {
      setMentionOpen(false)
    }

    // Check for / command
    const lastSlashIndex = value.lastIndexOf("/")
    if (lastSlashIndex !== -1 && lastSlashIndex === value.length - 1 && (lastSlashIndex === 0 || value[lastSlashIndex - 1] === " ")) {
      setSlashOpen(true)
      setMentionOpen(false)
    } else {
      setSlashOpen(false)
    }
  }

  const handleMentionSelect = (entity: string) => {
    setInput((prev) => prev.slice(0, -1) + `@${entity} `)
    setMentionOpen(false)
    textareaRef.current?.focus()
  }

  const handleCommandSelect = (command: string) => {
    setInput((prev) => prev.slice(0, -1) + `/${command} `)
    setSlashOpen(false)
    textareaRef.current?.focus()
  }

  const handleApplyChange = (messageIndex: number, contentIndex: number) => {
    setMessages((prev) =>
      prev.map((msg, mi) =>
        mi === messageIndex
          ? {
              ...msg,
              content: msg.content.map((c, ci) =>
                ci === contentIndex && c.type === "proposed_change"
                  ? { ...c, status: "applied" as const }
                  : c
              ),
            }
          : msg
      )
    )
    setPreviewOpen(false)
  }

  const handleRejectChange = (messageIndex: number, contentIndex: number) => {
    setMessages((prev) =>
      prev.map((msg, mi) =>
        mi === messageIndex
          ? {
              ...msg,
              content: msg.content.map((c, ci) =>
                ci === contentIndex && c.type === "proposed_change"
                  ? { ...c, status: "rejected" as const }
                  : c
              ),
            }
          : msg
      )
    )
    setPreviewOpen(false)
  }

  const handlePreviewChange = (messageIndex: number, contentIndex: number) => {
    const msg = messages[messageIndex]
    const content = msg.content[contentIndex]
    if (content.type === "proposed_change") {
      setPreviewChange({ change: content, mi: messageIndex, ci: contentIndex })
      setPreviewOpen(true)
    }
  }

  const handleApplyAll = () => {
    setConfirmDialogOpen(true)
  }

  const confirmApplyAll = () => {
    setMessages((prev) =>
      prev.map((msg) => ({
        ...msg,
        content: msg.content.map((c) =>
          c.type === "proposed_change" && c.status === "pending"
            ? { ...c, status: "applied" as const }
            : c
        ),
      }))
    )
    setConfirmDialogOpen(false)
  }

  const togglePin = (conversationId: string) => {
    setPinnedConversations((prev) =>
      prev.includes(conversationId)
        ? prev.filter((id) => id !== conversationId)
        : [...prev, conversationId]
    )
  }

  const switchToConversation = (conversationId: string) => {
    setActiveConversation(conversationId)
    // In real app, load conversation messages here
    if (conversationId === "conv-trivium" || mode === "trivium") {
      setMessages(mockConversationWithTrivium.messages)
    } else {
      setMessages(mockConversation.messages)
    }
  }

  const commands = [
    { id: "new-table", icon: Table2, label: t("commands.newTable") },
    { id: "new-workflow", icon: Workflow, label: t("commands.newWorkflow") },
    { id: "run", icon: Play, label: t("commands.run") },
    { id: "explain", icon: MessageSquare, label: t("commands.explain") },
  ]

  const hasMessages = messages.length > 0

  return (
    <TooltipProvider>
      <div className="flex h-full">
        {/* Left sidebar - conversation history */}
        <aside className="w-72 border-r flex flex-col">
          <div className="p-3 space-y-2">
            <Button className="w-full" onClick={handleNewConversation}>
              <Plus className="h-4 w-4 mr-2" />
              {t("history.new")}
            </Button>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("history.search")}
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 px-2">
            {/* Pinned */}
            {groupedHistory.pinned.length > 0 && (
              <div className="mb-4">
                <div className="px-3 py-1 text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Pin className="h-3 w-3" />
                  {t("history.pinned")}
                </div>
                {groupedHistory.pinned.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isActive={conv.id === activeConversation}
                    isPinned={true}
                    onSelect={() => switchToConversation(conv.id)}
                    onTogglePin={() => togglePin(conv.id)}
                    t={t}
                  />
                ))}
              </div>
            )}

            {/* Regular groups */}
            {(["今日", "今週", "今週より前"] as const).map((group) => {
              const convs = groupedHistory[group]
              if (convs.length === 0) return null
              return (
                <div key={group} className="mb-4">
                  <div className="px-3 py-1 text-xs font-medium text-muted-foreground">
                    {group}
                  </div>
                  {convs.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conv={conv}
                      isActive={conv.id === activeConversation}
                      isPinned={false}
                      onSelect={() => switchToConversation(conv.id)}
                      onTogglePin={() => togglePin(conv.id)}
                      t={t}
                    />
                  ))}
                </div>
              )
            })}
          </ScrollArea>
        </aside>

        {/* Center - chat */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <div className="h-14 border-b flex items-center justify-between px-4">
            <h2 className="font-medium">
              {hasMessages ? mockConversation.title : t("empty.title")}
            </h2>
            <div className="flex items-center gap-2">
              <Tabs
                value={mode}
                onValueChange={(v) => setMode(v as "sonnet" | "trivium")}
              >
                <TabsList>
                  <TabsTrigger value="sonnet">{t("modeSelect.sonnet")}</TabsTrigger>
                  <TabsTrigger value="trivium">{t("modeSelect.trivium")}</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages or Empty State */}
          {hasMessages ? (
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-6">
                {messages.map((msg, mi) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    onApplyChange={(ci) => handleApplyChange(mi, ci)}
                    onRejectChange={(ci) => handleRejectChange(mi, ci)}
                    onPreviewChange={(ci) => handlePreviewChange(mi, ci)}
                    isStreaming={isStreaming && mi === messages.length - 1}
                  />
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Sparkles className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <TypingDots />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          ) : (
            <EmptyState onPromptSelect={(prompt) => setInput(prompt)} />
          )}

          {/* Input area */}
          <div className="border-t p-4">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                placeholder={t("input.placeholder")}
                rows={1}
                className="pr-24 resize-none min-h-[44px] max-h-[192px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />

              {/* Mention Popover */}
              <Popover open={mentionOpen} onOpenChange={setMentionOpen}>
                <PopoverTrigger asChild>
                  <div className="absolute bottom-full left-0 mb-2" />
                </PopoverTrigger>
                <PopoverContent className="w-56 p-1" align="start">
                  <div className="text-xs text-muted-foreground px-2 py-1.5">
                    {t("input.mentionHint")}
                  </div>
                  {mockEntities.map((entity) => (
                    <Button
                      key={entity.id}
                      variant="ghost"
                      className="w-full justify-start h-8"
                      onClick={() => handleMentionSelect(entity.displayName)}
                    >
                      <Table2 className="h-3 w-3 mr-2" />
                      {entity.displayName}
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>

              {/* Slash Command Popover */}
              <Popover open={slashOpen} onOpenChange={setSlashOpen}>
                <PopoverTrigger asChild>
                  <div className="absolute bottom-full left-0 mb-2" />
                </PopoverTrigger>
                <PopoverContent className="w-64 p-1" align="start">
                  <div className="text-xs text-muted-foreground px-2 py-1.5">
                    {t("input.commandHint")}
                  </div>
                  {commands.map((cmd) => (
                    <Button
                      key={cmd.id}
                      variant="ghost"
                      className="w-full justify-start h-8"
                      onClick={() => handleCommandSelect(cmd.id)}
                    >
                      <cmd.icon className="h-3 w-3 mr-2" />
                      {cmd.label}
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{tCommon("comingSoon")}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                      <Mic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{tCommon("comingSoon")}</TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {t("input.sendHint")}
                </span>
                <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
                  <Send className="h-4 w-4 mr-1" />
                  {t("input.send")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar - pending changes */}
        <aside className="w-96 border-l flex flex-col">
          <div className="h-14 border-b flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">{t("pending.title")}</span>
              {pendingChanges.length > 0 && (
                <Badge variant="secondary">{pendingChanges.length}</Badge>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            {pendingChanges.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {t("pending.empty")}
              </div>
            ) : (
              <div className="space-y-3">
                {messages.flatMap((msg, mi) =>
                  msg.content
                    .map((c, ci) => ({ content: c, mi, ci }))
                    .filter(
                      (
                        item
                      ): item is {
                        content: Extract<MessageContent, { type: "proposed_change" }>
                        mi: number
                        ci: number
                      } =>
                        item.content.type === "proposed_change" &&
                        item.content.status === "pending"
                    )
                    .map(({ content, mi, ci }) => (
                      <Card key={`${mi}-${ci}`} className="text-sm">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium">{content.description}</p>
                              <Badge variant="secondary" className="text-xs mt-1">
                                {content.scope.split(".")[0]}
                              </Badge>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2"
                                onClick={() => handlePreviewChange(mi, ci)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2"
                                onClick={() => handleApplyChange(mi, ci)}
                              >
                                適用
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2"
                                onClick={() => handleRejectChange(mi, ci)}
                              >
                                却下
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            )}
          </ScrollArea>

          {pendingChanges.length > 0 && (
            <div className="p-4 border-t">
              <Button className="w-full" onClick={handleApplyAll}>
                {t("pending.applyAll")}
              </Button>
            </div>
          )}
        </aside>

        {/* Shortcuts button */}
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-8 w-8 rounded-full shadow-lg"
          onClick={() => setShortcutsOpen(true)}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* Preview Sheet */}
        <PreviewSheet
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          change={previewChange?.change ?? null}
          onApply={() => previewChange && handleApplyChange(previewChange.mi, previewChange.ci)}
          onReject={() => previewChange && handleRejectChange(previewChange.mi, previewChange.ci)}
        />

        {/* Confirm Dialog */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{tCommon("confirm")}</DialogTitle>
              <DialogDescription>
                {t("pending.confirmApplyAll", { n: pendingChanges.length })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                {tCommon("cancel")}
              </Button>
              <Button onClick={confirmApplyAll}>
                {t("pending.applyAll")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Shortcuts Dialog */}
        <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />

        {/* Command Palette */}
        <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
          <CommandInput placeholder={t("history.search")} />
          <CommandList>
            <CommandEmpty>{tCommon("noResults")}</CommandEmpty>
            <CommandGroup heading={t("history.pinned")}>
              {mockConversationHistory.filter(c => pinnedConversations.includes(c.id)).map((conv) => (
                <CommandItem
                  key={conv.id}
                  onSelect={() => {
                    switchToConversation(conv.id)
                    setCommandOpen(false)
                  }}
                >
                  <Pin className="h-4 w-4 mr-2" />
                  {conv.title}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading={t("history.today")}>
              {mockConversationHistory.filter(c => c.group === "今日" && !pinnedConversations.includes(c.id)).map((conv) => (
                <CommandItem
                  key={conv.id}
                  onSelect={() => {
                    switchToConversation(conv.id)
                    setCommandOpen(false)
                  }}
                >
                  {conv.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    </TooltipProvider>
  )
}

// ======== Conversation Item Component ========
function ConversationItem({
  conv,
  isActive,
  isPinned,
  onSelect,
  onTogglePin,
  t,
}: {
  conv: typeof mockConversationHistory[0]
  isActive: boolean
  isPinned: boolean
  onSelect: () => void
  onTogglePin: () => void
  t: ReturnType<typeof useTranslations<"builder">>
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onSelect}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors group",
            isActive
              ? "bg-accent"
              : "hover:bg-accent/50"
          )}
        >
          <span className="truncate flex-1 text-left">{conv.title}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("history.rename")}</DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onTogglePin(); }}>
                {isPinned ? (
                  <>
                    <PinOff className="h-3 w-3 mr-2" />
                    {t("history.unpin")}
                  </>
                ) : (
                  <>
                    <Pin className="h-3 w-3 mr-2" />
                    {t("history.pin")}
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                {t("history.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-xs">
        <div className="text-xs">
          <div className="font-medium">{new Date(conv.updatedAt).toLocaleString("ja-JP")}</div>
          <div className="text-muted-foreground mt-1 line-clamp-2">{conv.firstMessage}</div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
