"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Users,
  Briefcase,
  FileText,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  MoreHorizontal,
  Pencil,
  Database,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  mockEntities,
  mockCustomers,
  mockProjects,
  mockInvoices,
} from "@/lib/mock/data"
import type { Entity, Record } from "@/lib/types"

const iconMap: { [key: string]: React.ElementType } = {
  Users,
  Briefcase,
  FileText,
}

const recordsMap: { [key: string]: Record[] } = {
  customers: mockCustomers,
  projects: mockProjects,
  invoices: mockInvoices,
}

function formatValue(value: unknown, type: string): string {
  if (value === null || value === undefined) return "-"
  if (type === "checkbox") return value ? "✓" : "-"
  if (type === "number") return (value as number).toLocaleString()
  if (type === "date" || type === "datetime") {
    return new Date(value as string).toLocaleDateString("ja-JP")
  }
  if (type === "reference" && typeof value === "object") {
    return (value as { display: string }).display
  }
  return String(value)
}

export default function EntitiesPage() {
  const t = useTranslations("entities")
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedEntityId = searchParams.get("entity")

  const [entitySearch, setEntitySearch] = useState("")
  const [recordSearch, setRecordSearch] = useState("")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const filteredEntities = useMemo(() => {
    return mockEntities.filter((e) =>
      e.displayName.toLowerCase().includes(entitySearch.toLowerCase())
    )
  }, [entitySearch])

  const selectedEntity = mockEntities.find((e) => e.id === selectedEntityId)
  const records = selectedEntityId ? recordsMap[selectedEntityId] || [] : []

  const filteredRecords = useMemo(() => {
    if (!recordSearch) return records
    return records.filter((r) =>
      Object.values(r.data).some((v) =>
        String(v).toLowerCase().includes(recordSearch.toLowerCase())
      )
    )
  }, [records, recordSearch])

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const totalPages = Math.ceil(filteredRecords.length / pageSize)

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedRows.length === paginatedRecords.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedRecords.map((r) => r.id))
    }
  }

  return (
    <div className="flex h-full">
      {/* Left sidebar */}
      <aside className="w-64 border-r flex flex-col">
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              value={entitySearch}
              onChange={(e) => setEntitySearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto px-2">
          {filteredEntities.map((entity) => {
            const Icon = iconMap[entity.icon] || Database
            const isActive = entity.id === selectedEntityId
            return (
              <button
                key={entity.id}
                onClick={() => router.push(`/entities?entity=${entity.id}`)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1 text-left truncate">{entity.displayName}</span>
                <Badge variant="secondary" className="text-xs">
                  {entity.recordCount}
                </Badge>
              </button>
            )
          })}
        </div>

        <div className="p-3 border-t">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push("/builder?prompt=新しいテーブルを作りたい")}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("create")}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedEntity ? (
          <div className="flex-1 flex items-center justify-center">
            <Card className="max-w-sm text-center">
              <CardContent className="pt-8 pb-8">
                <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold mb-1">{t("empty.title")}</h2>
                <p className="text-sm text-muted-foreground">{t("empty.subtitle")}</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="border-b px-4 py-3 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>テーブル</span>
                <span>/</span>
                <span className="text-foreground font-medium">
                  {selectedEntity.displayName}
                </span>
              </div>

              <div className="flex-1" />

              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("recordSearch")}
                  value={recordSearch}
                  onChange={(e) => setRecordSearch(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                {t("toolbar.filter")}
              </Button>

              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-1" />
                {t("toolbar.sort")}
              </Button>

              <Tabs defaultValue="table">
                <TabsList>
                  <TabsTrigger value="table">{t("views.table")}</TabsTrigger>
                  <TabsTrigger value="kanban" disabled>
                    {t("views.kanban")}
                    <Badge variant="secondary" className="ml-1 text-[10px]">
                      {t("views.comingSoon")}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Button
                onClick={() => router.push(`/entities/${selectedEntity.id}/new`)}
              >
                <Plus className="h-4 w-4 mr-1" />
                {t("toolbar.addRecord")}
              </Button>
            </div>

            {/* Data grid */}
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          paginatedRecords.length > 0 &&
                          selectedRows.length === paginatedRecords.length
                        }
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    {selectedEntity.fields
                      .filter((f) => f.showInList)
                      .map((field) => (
                        <TableHead key={field.id}>{field.displayName}</TableHead>
                      ))}
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRecords.map((record) => (
                    <TableRow
                      key={record.id}
                      className="cursor-pointer"
                      onClick={() =>
                        router.push(`/entities/${selectedEntity.id}/${record.id}`)
                      }
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedRows.includes(record.id)}
                          onCheckedChange={() => toggleRow(record.id)}
                        />
                      </TableCell>
                      {selectedEntity.fields
                        .filter((f) => f.showInList)
                        .map((field) => (
                          <TableCell key={field.id}>
                            {formatValue(record.data[field.id], field.type)}
                          </TableCell>
                        ))}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/entities/${selectedEntity.id}/${record.id}/edit`
                                )
                              }
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              編集
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="border-t px-4 py-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t("pagination", {
                  from: (currentPage - 1) * pageSize + 1,
                  to: Math.min(currentPage * pageSize, filteredRecords.length),
                  total: filteredRecords.length,
                })}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Bulk action bar */}
            {selectedRows.length > 0 && (
              <div className="border-t bg-muted/50 px-4 py-3 flex items-center gap-4">
                <span className="text-sm font-medium">
                  {t("bulk.selected", { n: selectedRows.length })}
                </span>
                <Button variant="destructive" size="sm">
                  {t("bulk.delete")}
                </Button>
                <Button variant="outline" size="sm">
                  {t("bulk.export")}
                </Button>
                <div className="flex-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRows([])}
                >
                  {t("bulk.deselect")}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
