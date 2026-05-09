"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  LayoutDashboard,
  Database,
  Workflow,
  Sparkles,
  Settings,
  Moon,
  Sun,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockUser, mockTenant } from "@/lib/mock/data"

const navItems = [
  { href: "/", icon: LayoutDashboard, labelKey: "dashboard" },
  { href: "/entities", icon: Database, labelKey: "entities" },
  { href: "/workflows", icon: Workflow, labelKey: "workflows" },
  { href: "/builder", icon: Sparkles, labelKey: "builder" },
  { href: "/settings", icon: Settings, labelKey: "settings" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const t = useTranslations("nav")
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-sidebar flex flex-col">
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">kanribu-ai</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {t(item.labelKey)}
              </Link>
            )
          })}
        </nav>

        {/* Tenant info */}
        <div className="p-3 border-t">
          <div className="px-3 py-2 text-xs text-muted-foreground">
            {mockTenant.name}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b flex items-center justify-end px-4 gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {mockUser.avatarInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{mockUser.name}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                プロフィール
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
