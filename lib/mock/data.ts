import type {
  Entity,
  Record,
  ActivityItem,
  Workflow,
  Conversation,
  ApiKey,
  Member,
  MCPUsage,
  ExposedAgent,
  Invoice,
  WorkflowRun,
} from "@/lib/types"

export const mockTenant = {
  id: "tenant-1",
  name: "文唱堂印刷",
  slug: "bunshodo",
  locale: "ja" as const,
  timezone: "Asia/Tokyo",
  plan: "starter" as const,
  planPrice: 3000,
}

export const mockUser = {
  id: "user-1",
  name: "石嶋",
  email: "ishijima@bunshodo.example",
  avatarInitial: "石",
  role: "admin" as const,
}

export const mockEntities: Entity[] = [
  {
    id: "customers",
    displayName: "顧客",
    icon: "Users",
    recordCount: 247,
    exposed: true,
    description: "顧客のマスターデータ。会社名、業種、連絡先を含む。",
    fields: [
      { id: "company_name", displayName: "会社名", type: "text", required: true, showInList: true },
      {
        id: "industry",
        displayName: "業種",
        type: "select",
        options: ["製造業", "小売業", "IT", "サービス業", "その他"],
        showInList: true,
      },
      { id: "contact_email", displayName: "連絡先メール", type: "text", showInList: true },
      { id: "annual_revenue", displayName: "年商(円)", type: "number", showInList: true },
      { id: "created_at", displayName: "登録日", type: "datetime", showInList: true },
    ],
  },
  {
    id: "projects",
    displayName: "案件",
    icon: "Briefcase",
    recordCount: 31,
    exposed: true,
    description: "進行中・完了済みの案件。見積、納期、ステータスを含む。",
    fields: [
      { id: "project_name", displayName: "案件名", type: "text", required: true, showInList: true },
      { id: "customer", displayName: "顧客", type: "reference", target: "customers", showInList: true },
      {
        id: "status",
        displayName: "ステータス",
        type: "select",
        options: ["見積中", "受注", "進行中", "完了", "失注"],
        showInList: true,
      },
      { id: "estimate_amount", displayName: "見積金額", type: "number", showInList: true },
      { id: "due_date", displayName: "納期", type: "date", showInList: true },
    ],
  },
  {
    id: "invoices",
    displayName: "請求書",
    icon: "FileText",
    recordCount: 892,
    exposed: true,
    description: "請求書。金額、発行日、支払期日、支払状況を含む。",
    fields: [
      { id: "invoice_number", displayName: "請求書番号", type: "text", required: true, showInList: true },
      { id: "customer", displayName: "請求先", type: "reference", target: "customers", showInList: true },
      { id: "amount", displayName: "金額", type: "number", showInList: true },
      { id: "issue_date", displayName: "発行日", type: "date", showInList: true },
      { id: "due_date", displayName: "支払期日", type: "date", showInList: true },
      { id: "paid", displayName: "支払済", type: "checkbox", showInList: true },
    ],
  },
]

export const mockCustomers: Record[] = [
  {
    id: "cust-1",
    entityId: "customers",
    data: {
      company_name: "株式会社サンプル",
      industry: "IT",
      contact_email: "info@sample.co.jp",
      annual_revenue: 50000000,
      created_at: "2026-01-15T09:00:00+09:00",
    },
    createdAt: "2026-01-15T09:00:00+09:00",
    createdBy: { name: "田中", avatarInitial: "田" },
    updatedAt: "2026-04-20T14:30:00+09:00",
    updatedBy: { name: "石嶋", avatarInitial: "石" },
    mcpExposed: true,
  },
  {
    id: "cust-2",
    entityId: "customers",
    data: {
      company_name: "東京製造株式会社",
      industry: "製造業",
      contact_email: "contact@tokyo-mfg.co.jp",
      annual_revenue: 120000000,
      created_at: "2026-02-01T10:00:00+09:00",
    },
    createdAt: "2026-02-01T10:00:00+09:00",
    createdBy: { name: "石嶋", avatarInitial: "石" },
    updatedAt: "2026-05-01T11:00:00+09:00",
    updatedBy: { name: "中山", avatarInitial: "中" },
    mcpExposed: true,
  },
  {
    id: "cust-3",
    entityId: "customers",
    data: {
      company_name: "関西小売グループ",
      industry: "小売業",
      contact_email: "info@kansai-retail.co.jp",
      annual_revenue: 85000000,
      created_at: "2026-02-15T14:00:00+09:00",
    },
    createdAt: "2026-02-15T14:00:00+09:00",
    createdBy: { name: "中山", avatarInitial: "中" },
    updatedAt: "2026-03-10T09:30:00+09:00",
    updatedBy: { name: "田中", avatarInitial: "田" },
    mcpExposed: true,
  },
  {
    id: "cust-4",
    entityId: "customers",
    data: {
      company_name: "大阪サービス合同会社",
      industry: "サービス業",
      contact_email: "support@osaka-service.co.jp",
      annual_revenue: 30000000,
      created_at: "2026-03-01T11:00:00+09:00",
    },
    createdAt: "2026-03-01T11:00:00+09:00",
    createdBy: { name: "田中", avatarInitial: "田" },
    updatedAt: "2026-04-05T16:00:00+09:00",
    updatedBy: { name: "石嶋", avatarInitial: "石" },
    mcpExposed: true,
  },
  {
    id: "cust-5",
    entityId: "customers",
    data: {
      company_name: "北海道農産株式会社",
      industry: "その他",
      contact_email: "info@hokkaido-noosan.co.jp",
      annual_revenue: 75000000,
      created_at: "2026-03-20T09:00:00+09:00",
    },
    createdAt: "2026-03-20T09:00:00+09:00",
    createdBy: { name: "石嶋", avatarInitial: "石" },
    updatedAt: "2026-05-08T10:00:00+09:00",
    updatedBy: { name: "中山", avatarInitial: "中" },
    mcpExposed: true,
  },
]

export const mockProjects: Record[] = [
  {
    id: "proj-1",
    entityId: "projects",
    data: {
      project_name: "文唱堂印刷 Webサイトリニューアル",
      customer: { id: "cust-1", display: "株式会社サンプル" },
      status: "進行中",
      estimate_amount: 4500000,
      due_date: "2026-08-31",
    },
    createdAt: "2026-04-15T10:30:00+09:00",
    createdBy: { name: "田中", avatarInitial: "田" },
    updatedAt: "2026-05-09T03:30:00+09:00",
    updatedBy: { name: "田中", avatarInitial: "田" },
    mcpExposed: true,
  },
  {
    id: "proj-2",
    entityId: "projects",
    data: {
      project_name: "東京製造 カタログ印刷",
      customer: { id: "cust-2", display: "東京製造株式会社" },
      status: "見積中",
      estimate_amount: 1200000,
      due_date: "2026-07-15",
    },
    createdAt: "2026-05-01T14:00:00+09:00",
    createdBy: { name: "石嶋", avatarInitial: "石" },
    updatedAt: "2026-05-08T09:00:00+09:00",
    updatedBy: { name: "石嶋", avatarInitial: "石" },
    mcpExposed: true,
  },
  {
    id: "proj-3",
    entityId: "projects",
    data: {
      project_name: "関西小売 POP制作",
      customer: { id: "cust-3", display: "関西小売グループ" },
      status: "完了",
      estimate_amount: 350000,
      due_date: "2026-04-30",
    },
    createdAt: "2026-03-10T11:00:00+09:00",
    createdBy: { name: "中山", avatarInitial: "中" },
    updatedAt: "2026-04-28T17:00:00+09:00",
    updatedBy: { name: "中山", avatarInitial: "中" },
    mcpExposed: true,
  },
  {
    id: "proj-4",
    entityId: "projects",
    data: {
      project_name: "大阪サービス 名刺印刷",
      customer: { id: "cust-4", display: "大阪サービス合同会社" },
      status: "受注",
      estimate_amount: 80000,
      due_date: "2026-06-01",
    },
    createdAt: "2026-05-05T10:00:00+09:00",
    createdBy: { name: "田中", avatarInitial: "田" },
    updatedAt: "2026-05-07T14:00:00+09:00",
    updatedBy: { name: "田中", avatarInitial: "田" },
    mcpExposed: true,
  },
  {
    id: "proj-5",
    entityId: "projects",
    data: {
      project_name: "北海道農産 パッケージデザイン",
      customer: { id: "cust-5", display: "北海道農産株式会社" },
      status: "失注",
      estimate_amount: 2500000,
      due_date: "2026-05-15",
    },
    createdAt: "2026-02-20T09:00:00+09:00",
    createdBy: { name: "石嶋", avatarInitial: "石" },
    updatedAt: "2026-04-10T11:00:00+09:00",
    updatedBy: { name: "石嶋", avatarInitial: "石" },
    mcpExposed: false,
  },
]

export const mockInvoices: Record[] = [
  {
    id: "inv-1",
    entityId: "invoices",
    data: {
      invoice_number: "INV-2026-0042",
      customer: { id: "cust-1", display: "株式会社サンプル" },
      amount: 1500000,
      issue_date: "2026-04-01",
      due_date: "2026-04-30",
      paid: true,
    },
    createdAt: "2026-04-01T09:00:00+09:00",
    createdBy: { name: "中山", avatarInitial: "中" },
    updatedAt: "2026-04-28T10:00:00+09:00",
    updatedBy: { name: "中山", avatarInitial: "中" },
    mcpExposed: true,
  },
  {
    id: "inv-2",
    entityId: "invoices",
    data: {
      invoice_number: "INV-2026-0043",
      customer: { id: "cust-1", display: "株式会社サンプル" },
      amount: 1500000,
      issue_date: "2026-05-01",
      due_date: "2026-05-31",
      paid: false,
    },
    createdAt: "2026-05-01T09:00:00+09:00",
    createdBy: { name: "中山", avatarInitial: "中" },
    updatedAt: "2026-05-01T09:00:00+09:00",
    updatedBy: { name: "中山", avatarInitial: "中" },
    mcpExposed: true,
  },
  {
    id: "inv-3",
    entityId: "invoices",
    data: {
      invoice_number: "INV-2026-0044",
      customer: { id: "cust-2", display: "東京製造株式会社" },
      amount: 800000,
      issue_date: "2026-04-15",
      due_date: "2026-05-15",
      paid: true,
    },
    createdAt: "2026-04-15T14:00:00+09:00",
    createdBy: { name: "田中", avatarInitial: "田" },
    updatedAt: "2026-05-10T11:00:00+09:00",
    updatedBy: { name: "田中", avatarInitial: "田" },
    mcpExposed: true,
  },
  {
    id: "inv-4",
    entityId: "invoices",
    data: {
      invoice_number: "INV-2026-0045",
      customer: { id: "cust-3", display: "関西小売グループ" },
      amount: 350000,
      issue_date: "2026-04-28",
      due_date: "2026-05-28",
      paid: false,
    },
    createdAt: "2026-04-28T17:00:00+09:00",
    createdBy: { name: "中山", avatarInitial: "中" },
    updatedAt: "2026-04-28T17:00:00+09:00",
    updatedBy: { name: "中山", avatarInitial: "中" },
    mcpExposed: true,
  },
  {
    id: "inv-5",
    entityId: "invoices",
    data: {
      invoice_number: "INV-2026-0046",
      customer: { id: "cust-4", display: "大阪サービス合同会社" },
      amount: 80000,
      issue_date: "2026-05-07",
      due_date: "2026-06-07",
      paid: false,
    },
    createdAt: "2026-05-07T14:00:00+09:00",
    createdBy: { name: "田中", avatarInitial: "田" },
    updatedAt: "2026-05-07T14:00:00+09:00",
    updatedBy: { name: "田中", avatarInitial: "田" },
    mcpExposed: true,
  },
]

export const mockRecentActivity: ActivityItem[] = [
  {
    id: "act-1",
    user: "田中",
    avatarInitial: "田",
    action: "作成",
    entity: "顧客",
    recordTitle: "株式会社サンプル",
    time: "5分前",
  },
  {
    id: "act-2",
    user: "石嶋",
    avatarInitial: "石",
    action: "更新",
    entity: "案件",
    recordTitle: "Webサイトリニューアル",
    time: "15分前",
  },
  {
    id: "act-3",
    user: "中山",
    avatarInitial: "中",
    action: "作成",
    entity: "請求書",
    recordTitle: "INV-2026-0046",
    time: "1時間前",
  },
  {
    id: "act-4",
    user: "田中",
    avatarInitial: "田",
    action: "更新",
    entity: "顧客",
    recordTitle: "東京製造株式会社",
    time: "2時間前",
  },
  {
    id: "act-5",
    user: "石嶋",
    avatarInitial: "石",
    action: "削除",
    entity: "案件",
    recordTitle: "テスト案件",
    time: "3時間前",
  },
  {
    id: "act-6",
    user: "中山",
    avatarInitial: "中",
    action: "作成",
    entity: "案件",
    recordTitle: "名刺印刷",
    time: "5時間前",
  },
  {
    id: "act-7",
    user: "田中",
    avatarInitial: "田",
    action: "更新",
    entity: "請求書",
    recordTitle: "INV-2026-0042",
    time: "昨日",
  },
  {
    id: "act-8",
    user: "石嶋",
    avatarInitial: "石",
    action: "作成",
    entity: "顧客",
    recordTitle: "九州物流株式会社",
    time: "昨日",
  },
  {
    id: "act-9",
    user: "中山",
    avatarInitial: "中",
    action: "更新",
    entity: "案件",
    recordTitle: "POP制作",
    time: "2日前",
  },
  {
    id: "act-10",
    user: "田中",
    avatarInitial: "田",
    action: "作成",
    entity: "請求書",
    recordTitle: "INV-2026-0041",
    time: "3日前",
  },
]

export const mockWorkflows: Workflow[] = [
  {
    id: "wf-1",
    name: "見積精査エージェント",
    description: "提出予定の見積書を TRIVIUM で多角的に精査",
    targetEntity: "estimates",
    targetEntityDisplay: "見積",
    trigger: "manual",
    agentMode: "trivium",
    a2aExposed: true,
    lastRun: { time: "30分前", status: "success" },
    monthlyRuns: 142,
  },
  {
    id: "wf-2",
    name: "新規顧客の自動リサーチ",
    description: "顧客レコード作成時に企業情報を自動調査して埋める",
    targetEntity: "customers",
    targetEntityDisplay: "顧客",
    trigger: "on-create",
    agentMode: "single",
    agentModel: "Claude Sonnet",
    a2aExposed: false,
    lastRun: { time: "2時間前", status: "success" },
    monthlyRuns: 87,
  },
  {
    id: "wf-3",
    name: "支払遅延アラート",
    description: "支払期日を過ぎた請求書を毎朝チェック",
    targetEntity: "invoices",
    targetEntityDisplay: "請求書",
    trigger: "scheduled",
    schedule: "0 9 * * *",
    agentMode: "single",
    agentModel: "Claude Sonnet",
    a2aExposed: false,
    lastRun: { time: "今朝 9:00", status: "success" },
    monthlyRuns: 9,
  },
  {
    id: "wf-4",
    name: "MQ レート異常検知",
    description: "MQ会計の異常パターンを検知して通知",
    targetEntity: null,
    targetEntityDisplay: "全体",
    trigger: "scheduled",
    schedule: "0 8 * * 1",
    agentMode: "trivium",
    a2aExposed: true,
    lastRun: { time: "3日前", status: "failed" },
    monthlyRuns: 4,
  },
]

export const mockWorkflowDetail = {
  id: "wf-1",
  name: "見積精査エージェント",
  description: "提出予定の見積書を TRIVIUM で多角的に精査",
  trigger: { type: "manual" as const },
  agent: {
    mode: "trivium" as const,
    trivium: {
      grammatica: {
        model: "gpt-4",
        prompt:
          "あなたは経験豊富な見積精査の専門家です。提出された見積書のリスクと機会を網羅的に列挙してください。",
      },
      logica: {
        model: "claude-sonnet",
        prompt:
          "GRAMMATICAの提案を論理的に検証し、見落としや矛盾を指摘してください。特に印刷業界の慣習に照らして妥当性を確認してください。",
      },
      rhetorica: {
        model: "gemini-pro",
        prompt:
          "両者の見解を統合し、経営判断に使える形で結論を提示してください。リスクレベル(低/中/高)、推奨アクション、根拠の3点で構成してください。",
      },
      humanApprovalRequired: false,
    },
    maxTokens: 4000,
    temperature: 0.5,
  },
  a2aExposed: true,
  a2aAgentCardUrl: "https://kanribu-ai.example.com/a2a/bunshodo/estimate-reviewer/.well-known/agent.json",
}

export const mockRunWithTrivium: WorkflowRun = {
  id: "run-abc-123",
  workflowId: "wf-1",
  startedAt: "2026-05-09T03:00:00+09:00",
  duration: "47秒",
  status: "completed",
  cost: 0.84,
  triggeredBy: "手動 (石嶋)",
  trivium: {
    grammatica: {
      model: "gpt-4",
      tokensIn: 1234,
      tokensOut: 567,
      cost: 0.45,
      output:
        "見積書を確認しました。以下のリスクと機会が見られます。\n\nリスク:\n1. 紙単価が市場価格より15%安い (調達リスク)\n2. 納期2週間は通常の60%、特急対応費が含まれていない\n3. 校正回数の上限が定義されていない\n\n機会:\n1. ロット数が大きく追加発注の可能性が高い\n2. 顧客の年商規模から長期取引に発展しうる",
    },
    logica: {
      model: "claude-sonnet",
      tokensIn: 1890,
      tokensOut: 412,
      cost: 0.27,
      output:
        "GRAMMATICAの分析は概ね妥当ですが、3点修正します。\n\n1. 紙単価15%安の指摘は正しいが、月末仕入のスポット価格である可能性があり、必ずしもリスクではない\n2. 納期に関しては、印刷業界慣習として2週間は通常範囲内。特急ではない\n3. 校正回数上限の懸念は妥当。文唱堂の標準契約では3回までだが、本見積には記載なし\n\n見落とされた点:\n- 配送費の取り扱いが不明 (含むか別か)\n- 検版の責任分界点が記載されていない",
    },
    rhetorica: {
      model: "gemini-pro",
      tokensIn: 2456,
      tokensOut: 234,
      cost: 0.12,
      output:
        "リスクレベル: 中\n\n推奨アクション:\n見積を提出する前に以下3点を明確化:\n1. 校正回数の上限(標準3回を明記)\n2. 配送費の扱い(別途請求か込みか)\n3. 検版責任の分界点\n\n根拠:\n- 紙単価と納期に関するGRAMMATICAの懸念はLOGICAの業界知識で否定された\n- 校正回数と配送費はLOGICAが独自に指摘した実務上の重要点\n- これらが明確でない見積は後工程でトラブルの原因となる確率が高い",
    },
  },
}

export const mockConversation: Conversation = {
  id: "conv-1",
  title: "請求書テーブルに支払期日を追加",
  createdAt: "2026-05-09T02:00:00+09:00",
  updatedAt: "2026-05-09T02:30:00+09:00",
  messages: [
    {
      id: "msg-1",
      role: "user",
      content: [
        {
          type: "text",
          text: "請求書テーブルに支払期日カラムを追加して、過ぎたら自動でアラートを出すようにしたい",
        },
      ],
      timestamp: "2026-05-09T02:00:00+09:00",
    },
    {
      id: "msg-2",
      role: "assistant",
      content: [
        { type: "text", text: "了解しました。2つの変更を提案します:" },
        {
          type: "tool_call",
          name: "get_current_config",
          input: {},
          output: { entities: ["customers", "projects", "invoices"] },
        },
        { type: "text", text: "現在の請求書テーブルには `due_date` がないので、まず追加します。" },
        {
          type: "proposed_change",
          scope: "entities.invoices",
          description: "新しいフィールド: 支払期日",
          diff: {
            before: "fields: [invoice_number, customer, amount, issue_date, paid]",
            after: "fields: [invoice_number, customer, amount, issue_date, due_date, paid]",
          },
          status: "pending",
        },
        { type: "text", text: "次に、支払期日を過ぎた請求書を毎朝チェックするワークフローを作成します。" },
        {
          type: "proposed_change",
          scope: "workflows",
          description: "新しいワークフロー: 支払遅延アラート",
          diff: {
            before: "(なし)",
            after: "trigger: scheduled (毎日 9:00), agent: Claude Sonnet, action: send Slack notification",
          },
          status: "pending",
        },
      ],
      timestamp: "2026-05-09T02:01:00+09:00",
    },
  ],
}

export const mockConversationHistory = [
  { id: "conv-1", title: "請求書テーブルに支払期日を追加", updatedAt: "2026-05-09T02:30:00+09:00", group: "今日" },
  { id: "conv-2", title: "顧客テーブルに業種を追加", updatedAt: "2026-05-08T14:00:00+09:00", group: "今日" },
  { id: "conv-3", title: "見積精査ワークフローの作成", updatedAt: "2026-05-07T10:00:00+09:00", group: "今週" },
  { id: "conv-4", title: "MCP公開設定の確認", updatedAt: "2026-05-05T16:00:00+09:00", group: "今週" },
  { id: "conv-5", title: "新規テーブル作成: 見積", updatedAt: "2026-04-28T11:00:00+09:00", group: "今週より前" },
]

export const mockDashboardData = {
  tenantName: "文唱堂印刷",
  newChangesCount: 12,
  stats: {
    entities: { value: 12, delta: 2 },
    recordsThisMonth: { value: 1847, delta: 312 },
    workflowRunsThisMonth: { value: 234, delta: -18 },
  },
  mcp: {
    status: "running" as const,
    endpoint: "https://kanribu-ai.example.com/mcp/bunshodo",
    a2aEndpoint: "https://kanribu-ai.example.com/a2a/bunshodo",
    callHistory: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      calls: 300 + Math.floor(Math.random() * 1200),
    })),
    used: 63421,
    quota: 100000,
  },
}

export const mockApiKeys: ApiKey[] = [
  {
    id: "k1",
    name: "Claude Desktop (石嶋)",
    prefix: "sk_live_a8b7c6...",
    createdAt: "2026-04-20",
    lastUsed: "5分前",
  },
  {
    id: "k2",
    name: "Cursor (開発用)",
    prefix: "sk_live_d9e0f1...",
    createdAt: "2026-05-01",
    lastUsed: "1時間前",
  },
]

export const mockMembers: Member[] = [
  {
    id: "m1",
    name: "石嶋",
    email: "ishijima@bunshodo.example",
    role: "admin",
    joinedAt: "2026-04-01",
    avatarInitial: "石",
  },
  {
    id: "m2",
    name: "中山",
    email: "snakayama@bunshodo.example",
    role: "editor",
    joinedAt: "2026-04-15",
    avatarInitial: "中",
  },
]

export const mockMcpUsage: MCPUsage = {
  thisMonth: 63421,
  lastMonth: 58103,
  quota: 100000,
  history: Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    calls: 1500 + Math.floor(Math.random() * 1500),
  })),
}

export const mockExposedAgents: ExposedAgent[] = [
  {
    workflowId: "wf-1",
    name: "見積精査エージェント",
    cardUrl: "https://kanribu-ai.example.com/a2a/bunshodo/estimate-reviewer/.well-known/agent.json",
  },
  {
    workflowId: "wf-4",
    name: "MQ レート異常検知",
    cardUrl: "https://kanribu-ai.example.com/a2a/bunshodo/mq-anomaly/.well-known/agent.json",
  },
]

export const mockBillingInvoices: Invoice[] = [
  { id: "bi-1", date: "2026-04-01", amount: 3000, status: "paid", invoiceUrl: "#" },
  { id: "bi-2", date: "2026-03-01", amount: 3000, status: "paid", invoiceUrl: "#" },
]

export const mockActivityLog = [
  {
    id: "al-1",
    user: "田中",
    avatarInitial: "田",
    action: "更新" as const,
    timeRelative: "2時間前",
    diff: { status: { before: "受注", after: "進行中" } },
  },
  {
    id: "al-2",
    user: "石嶋",
    avatarInitial: "石",
    action: "更新" as const,
    timeRelative: "1日前",
    diff: { estimate_amount: { before: "4,000,000", after: "4,500,000" } },
  },
  {
    id: "al-3",
    user: "中山",
    avatarInitial: "中",
    action: "作成" as const,
    timeRelative: "3日前",
    diff: {},
  },
]

export const mockRelatedRecords = {
  invoices: [
    { id: "inv-1", invoice_number: "INV-2026-0042", amount: 1500000 },
    { id: "inv-2", invoice_number: "INV-2026-0043", amount: 1500000 },
  ],
}
