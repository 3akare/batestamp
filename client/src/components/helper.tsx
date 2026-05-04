import React, { useRef, useState, useCallback } from "react"
import {
  CloudArrowUp,
  DotsSixVertical,
  FilePdf,
  Image as ImageIcon,
  FileXls,
  X,
  CaretLeft,
  CaretRight,
  CheckCircle,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// ─── Types ────────────────────────────────────────────────────────────────────

type FileType = "pdf" | "img" | "xlsx"
type FileTag = "STAMP" | "IMAGE" | "PLACEHOLDER"

interface UploadedFile {
  id: number
  type: FileType
  name: string
  range: string
  tag: FileTag
  active: boolean
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_FILES: UploadedFile[] = [
  {
    id: 1,
    type: "pdf",
    name: "Contract_Agreement.pdf",
    range: "BATES_0001–0010",
    tag: "STAMP",
    active: false,
  },
  {
    id: 2,
    type: "img",
    name: "Exhibit_Photo_01.jpg",
    range: "BATES_0011–0018",
    tag: "IMAGE",
    active: false,
  },
  {
    id: 3,
    type: "xlsx",
    name: "Financial_Report_Q1.xlsx",
    range: "BATES_0019–0026",
    tag: "STAMP",
    active: false,
  },
  {
    id: 4,
    type: "pdf",
    name: "Deposition_Transcript_Part1.pdf",
    range: "BATES_0027–0035",
    tag: "STAMP",
    active: true,
  },
  {
    id: 5,
    type: "img",
    name: "Diagram_Schematic.png",
    range: "BATES_0036–0040",
    tag: "IMAGE",
    active: false,
  },
  {
    id: 6,
    type: "pdf",
    name: "Settlement_Offer.pdf",
    range: "BATES_0041–0047",
    tag: "PLACEHOLDER",
    active: false,
  },
  {
    id: 7,
    type: "pdf",
    name: "Supplemental_Brief.pdf",
    range: "BATES_0048–0055",
    tag: "STAMP",
    active: false,
  },
  {
    id: 8,
    type: "img",
    name: "Accident_Scene_02.png",
    range: "BATES_0056–0060",
    tag: "IMAGE",
    active: false,
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function FileIcon({ type }: { type: FileType }) {
  if (type === "pdf") return <FilePdf className="size-3.5" />
  if (type === "img") return <ImageIcon className="size-3.5" />
  if (type === "xlsx") return <FileXls className="size-3.5" />
  return <FilePdf className="size-3.5" />
}

function TagBadge({ tag }: { tag: FileTag }) {
  const map: Record<FileTag, string> = {
    STAMP:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
    IMAGE:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800",
    PLACEHOLDER: "bg-muted text-muted-foreground border-border",
  }
  return (
    <span
      className={`rounded border px-1.5 py-0.5 font-mono text-[9px] font-medium tracking-wide uppercase ${map[tag]}`}
    >
      {tag}
    </span>
  )
}

// ─── FileUploader ─────────────────────────────────────────────────────────────

function FileUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleBrowse = () => fileInputRef.current?.click()
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])
  const handleDragLeave = useCallback(() => setIsDragging(false), [])
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  return (
    <Card className="shrink-0 shadow-sm">
      <CardHeader className="px-4 pt-3 pb-1.5">
        <CardTitle className="text-xs font-medium">1. Upload Files</CardTitle>
        <CardDescription className="text-[11px] text-muted-foreground">
          Drag and drop or browse
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-3">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-2.5 rounded-lg border border-dashed px-4 py-5 transition-colors ${
            isDragging
              ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30"
              : "border-border bg-card hover:border-muted-foreground/40 hover:bg-muted/20"
          }`}
        >
          <div className="flex size-7 items-center justify-center rounded-md bg-muted">
            <CloudArrowUp
              weight="light"
              className="size-3.5 text-muted-foreground"
            />
          </div>
          <div className="text-center">
            <p className="font-serif text-xs tracking-tight text-foreground">
              Upload files
            </p>
            <p className="mt-0.5 text-[9px] font-light tracking-wide text-muted-foreground uppercase">
              PDF · JPG · PNG · TIFF · XLSX
            </p>
          </div>
          <Input type="file" ref={fileInputRef} className="hidden" multiple />
          <Button
            variant="outline"
            className="h-6 w-24 text-[11px] font-normal"
            onClick={handleBrowse}
          >
            Browse Files
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── FileList ─────────────────────────────────────────────────────────────────

interface FileListProps {
  files: UploadedFile[]
  activeFileId: number
  onSetActive: (id: number) => void
  onRemove: (id: number) => void
}

function FileList({
  files,
  activeFileId,
  onSetActive,
  onRemove,
}: FileListProps) {
  return (
    <Card className="flex min-h-0 flex-1 flex-col overflow-hidden shadow-sm">
      <CardHeader className="shrink-0 flex-row items-center justify-between px-4 pt-3 pb-2">
        <CardTitle className="text-xs font-medium">2. Uploaded Files</CardTitle>
        <span className="font-mono text-[11px] text-muted-foreground">
          {files.length}
        </span>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden border-t p-0">
        <div className="flex-1 divide-y overflow-y-auto">
          {files.map((file) => (
            <button
              key={file.id}
              onClick={() => onSetActive(file.id)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-muted/50 ${
                file.id === activeFileId ? "bg-muted/60" : ""
              }`}
            >
              <DotsSixVertical className="size-3.5 shrink-0 cursor-grab text-muted-foreground/40" />

              <div
                className={`flex size-5 shrink-0 items-center justify-center rounded border ${
                  file.type === "pdf"
                    ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
                    : file.type === "img"
                      ? "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400"
                      : "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400"
                }`}
              >
                <FileIcon type={file.type} />
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-normal text-foreground">
                  {file.name}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {file.range}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <TagBadge tag={file.tag} />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(file.id)
                  }}
                  className="rounded p-0.5 text-muted-foreground/40 transition-colors hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </div>
            </button>
          ))}
        </div>

        <div className="shrink-0 border-t bg-muted/20 px-4 py-2">
          <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
            <span>{files.length} files · 60 pages</span>
            <span>0001 → 0060</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── DocumentPreview ──────────────────────────────────────────────────────────

function DocumentPreview({
  activeFile,
}: {
  activeFile: UploadedFile | undefined
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden">
      {/* Toolbar */}
      <Card className="flex h-10 shrink-0 items-center gap-3 px-3 shadow-sm">
        {/* Filename */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex size-5 shrink-0 items-center justify-center rounded border border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            <FilePdf className="size-3" />
          </div>
          <span className="truncate font-mono text-[11px] text-foreground">
            {activeFile?.name ?? "—"}
          </span>
        </div>

        {/* Divider */}
        <div className="h-4 w-px shrink-0 bg-border" />

        {/* Page nav */}
        <div className="flex shrink-0 items-center gap-1.5">
          <Button variant="outline" size="icon" className="size-5 rounded">
            <CaretLeft className="size-2.5" />
          </Button>
          <span className="font-mono text-[11px] text-muted-foreground">
            Page 3 of 10
          </span>
          <Button variant="outline" size="icon" className="size-5 rounded">
            <CaretRight className="size-2.5" />
          </Button>
        </div>

        {/* Divider */}
        <div className="h-4 w-px shrink-0 bg-border" />

        {/* Bates label */}
        <span className="shrink-0 font-mono text-[11px] font-medium tracking-widest text-muted-foreground">
          BATES_0003
        </span>
      </Card>

      {/* Document canvas */}
      <div className="flex-1 overflow-auto">
        <div className="relative mx-auto aspect-[17/22] w-full max-w-[680px] overflow-hidden rounded-lg border bg-white font-serif text-[11px] leading-relaxed text-zinc-800 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
          <div className="absolute inset-0 overflow-hidden p-10">
            <div className="space-y-4">
              <p className="text-center text-[10px] font-medium tracking-wide text-zinc-500 uppercase">
                In the United States District Court
                <br />
                for the Northern District of Example
              </p>

              <div className="mt-6 flex">
                <div className="flex-1 space-y-3">
                  <p>
                    JOHN DOE,
                    <br />
                    <span className="pl-6">Plaintiff,</span>
                  </p>
                  <p className="pl-3">v.</p>
                  <p>
                    ACME CORPORATION,
                    <br />
                    <span className="pl-6">Defendant.</span>
                  </p>
                </div>
                <div className="mx-4 w-px bg-zinc-200 dark:bg-zinc-700" />
                <div className="flex-1 space-y-3 pt-1">
                  <p>Case No. 1:23-cv-01234</p>
                  <p className="font-medium">DEPOSITION OF JANE SMITH</p>
                  <p>June 5, 2024</p>
                </div>
              </div>

              <div className="my-4 border-t border-zinc-200 dark:border-zinc-700" />

              <p>
                THE VIDEOGRAPHER: This is the deposition of Jane Smith taken on
                June 5, 2024, commencing at 9:02 a.m., at the offices of Legal
                Services, 123 Main Street, Example City.
              </p>

              <div className="mt-4">
                <p className="font-medium">APPEARANCES:</p>
                <div className="mt-1.5 space-y-1 pl-6">
                  <p>
                    For the Plaintiff:{" "}
                    <span className="pl-2">Mr. Alan Counsel, Esq.</span>
                  </p>
                  <p>
                    For the Defendant:{" "}
                    <span className="pl-2">Ms. Rebecca Advocate, Esq.</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p>THE WITNESS: My name is Jane Smith.</p>
                <p className="font-medium">BY MR. COUNSEL:</p>
                <div className="flex gap-3">
                  <span className="w-4 shrink-0">Q.</span>
                  <p>
                    Please state your current position with Acme Corporation.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="w-4 shrink-0">A.</span>
                  <p>I am the Director of Operations.</p>
                </div>
                <div className="flex gap-3">
                  <span className="w-4 shrink-0">Q.</span>
                  <p>How long have you held that position?</p>
                </div>
                <div className="flex gap-3">
                  <span className="w-4 shrink-0">A.</span>
                  <p>Since January of 2021.</p>
                </div>
                <div className="flex gap-3">
                  <span className="w-4 shrink-0">Q.</span>
                  <p>Could you describe your responsibilities in that role?</p>
                </div>
                <div className="flex gap-3">
                  <span className="w-4 shrink-0">A.</span>
                  <p>
                    I oversee day-to-day operations, manage departmental
                    budgets, and coordinate with other departments to implement
                    company initiatives.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-8 bottom-6 border border-zinc-200 bg-white/90 px-2 py-0.5 font-mono text-[10px] font-medium tracking-widest text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950/90 dark:text-zinc-200">
            PLAINTIFF_0003
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[9px] text-zinc-400">
            — 3 —
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── SettingsPanel ────────────────────────────────────────────────────────────

interface SettingsPanelProps {
  fileCount: number
  confidentiality: boolean
  onConfidentialityChange: (v: boolean) => void
}

function SettingsPanel({
  fileCount,
  confidentiality,
  onConfidentialityChange,
}: SettingsPanelProps) {
  return (
    <div className="flex h-full w-[256px] shrink-0 flex-col gap-3">
      <Card className="shrink-0 shadow-sm">
        <CardHeader className="px-4 pt-3 pb-2">
          <CardTitle className="text-xs font-medium">
            3. Production Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5 px-4 pb-3">
          <div className="flex items-center gap-3">
            <Label className="w-20 shrink-0 text-xs font-normal text-muted-foreground">
              Prefix
            </Label>
            <Input
              className="h-7 flex-1 font-mono text-xs"
              defaultValue="PLAINTIFF_"
            />
          </div>

          <div className="flex items-center gap-3">
            <Label className="w-20 shrink-0 text-xs font-normal text-muted-foreground">
              Start Num
            </Label>
            <Input
              type="number"
              className="h-7 flex-1 font-mono text-xs"
              defaultValue={1}
            />
          </div>

          <div className="flex items-center gap-3">
            <Label className="w-20 shrink-0 text-xs font-normal text-muted-foreground">
              Font Size
            </Label>
            <Input
              type="number"
              className="h-7 flex-1 font-mono text-xs"
              defaultValue={10}
            />
          </div>

          <div className="space-y-1.5 pt-1">
            <Label className="text-xs font-normal text-muted-foreground">
              Position
            </Label>
            <RadioGroup
              defaultValue="br"
              className="flex items-center justify-between rounded-md border bg-muted/20 px-3 py-2"
            >
              {[
                ["bl", "Left"],
                ["bc", "Center"],
                ["br", "Right"],
              ].map(([val, label]) => (
                <div key={val} className="flex items-center gap-1.5">
                  <RadioGroupItem value={val} id={val} className="size-3" />
                  <Label
                    htmlFor={val}
                    className="cursor-pointer text-xs font-normal"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2.5 border-t pt-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-normal text-muted-foreground">
                Confidentiality Notice
              </Label>
              <Switch
                checked={confidentiality}
                onCheckedChange={onConfidentialityChange}
                className="origin-right scale-75"
              />
            </div>
            {confidentiality && (
              <div className="rounded-md border border-orange-200 bg-orange-50 px-3 py-2 dark:border-orange-900/50 dark:bg-orange-950/20">
                <p className="font-mono text-[10px] leading-relaxed font-medium text-orange-700 dark:text-orange-400">
                  CONFIDENTIAL — SUBJECT TO PROTECTIVE ORDER
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shrink-0 shadow-sm">
        <CardContent className="space-y-2 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Files ready</span>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="size-3.5" weight="fill" />
              <span className="font-mono text-xs font-medium">
                {fileCount} / {fileCount}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total pages</span>
            <span className="font-mono text-xs font-medium">60</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Bates range</span>
            <span className="font-mono text-xs font-medium">0001 → 0060</span>
          </div>
        </CardContent>
      </Card>

      <Button className="h-8 w-full shrink-0 text-xs font-medium">
        Export Production — $9
      </Button>

      <div className="flex-1" />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Helper() {
  const [files, setFiles] = useState<UploadedFile[]>(MOCK_FILES)
  const [activeFileId, setActiveFileId] = useState<number>(4)
  const [confidentiality, setConfidentiality] = useState(false)

  const removeFile = (id: number) =>
    setFiles((prev) => prev.filter((f) => f.id !== id))
  const activeFile = files.find((f) => f.id === activeFileId) ?? files[0]

  return (
    <div className="flex h-screen w-full gap-3 overflow-hidden bg-muted p-4 dark:bg-background">
      <div className="flex h-full w-[256px] shrink-0 flex-col gap-3">
        <FileUploader />
        <FileList
          files={files}
          activeFileId={activeFileId}
          onSetActive={setActiveFileId}
          onRemove={removeFile}
        />
      </div>

      <DocumentPreview activeFile={activeFile} />

      <SettingsPanel
        fileCount={files.length}
        confidentiality={confidentiality}
        onConfidentialityChange={setConfidentiality}
      />
    </div>
  )
}
