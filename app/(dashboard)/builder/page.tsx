"use client"

import { useState, useRef, useEffect } from "react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  mockConversation,
  mockConversationHistory,
  mockUser,
} from "@/lib/mock/data"
import type { MessageContent, ConversationMessage } from "@/lib/types"

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  )
}

function ProposedChangeCard({
  change,
  onApply,
  onReject,
}: {
  change: Extract<MessageContent, { type: "proposed_change" }>
  onApply: () => void
  onReject: () => void
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

function MessageBubble({
  message,
  onApplyChange,
  onRejectChange,
}: {
  message: ConversationMessage
  onApplyChange: (index: number) => void
  onRejectChange: (index: number) => void
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
                {content.text}
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
              />
            )
          }
          if (content.type === "tool_call") {
            return <ToolCallCard key={i} call={content} />
          }
          return null
        })}
      </div>
    </div>
  )
}

export default function BuilderPage() {
  const t = useTranslations("builder")
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get("prompt") || ""

  const [messages, setMessages] = useState(mockConversation.messages)
  const [input, setInput] = useState(initialPrompt)
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<"sonnet" | "trivium">("sonnet")
  const [activeConversation, setActiveConversation] = useState(mockConversation.id)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const pendingChanges = messages
    .flatMap((m) => m.content)
    .filter(
      (c): c is Extract<MessageContent, { type: "proposed_change" }> =>
        c.type === "proposed_change" && c.status === "pending"
    )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ConversationMessage = {
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
      setIsLoading(false)
    }, 1500)
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
  }

  const handleApplyAll = () => {
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
  }

  const groupedHistory = {
    今日: mockConversationHistory.filter((c) => c.group === "今日"),
    今週: mockConversationHistory.filter((c) => c.group === "今週"),
    今週より前: mockConversationHistory.filter((c) => c.group === "今週より前"),
  }

  return (
    <div className="flex h-full">
      {/* Left sidebar - conversation history */}
      <aside className="w-72 border-r flex flex-col">
        <div className="p-3">
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {t("history.new")}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2">
          {Object.entries(groupedHistory).map(([group, convs]) => (
            <div key={group} className="mb-4">
              <div className="px-3 py-1 text-xs font-medium text-muted-foreground">
                {group}
              </div>
              {convs.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors group",
                    conv.id === activeConversation
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
                      <DropdownMenuItem>名前を変更</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        削除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </button>
              ))}
            </div>
          ))}
        </ScrollArea>
      </aside>

      {/* Center - chat */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="h-14 border-b flex items-center justify-between px-4">
          <h2 className="font-medium">{mockConversation.title}</h2>
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

        {/* Messages */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            {messages.map((msg, mi) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onApplyChange={(ci) => handleApplyChange(mi, ci)}
                onRejectChange={(ci) => handleRejectChange(mi, ci)}
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

        {/* Input area */}
        <div className="border-t p-4">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("input.placeholder")}
              rows={2}
              className="pr-24 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                ⌘+Enter で送信
              </span>
              <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
                <Send className="h-4 w-4 mr-1" />
                送信
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
    </div>
  )
}
