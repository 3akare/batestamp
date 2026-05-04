import React, { useRef, useState, useCallback, useEffect } from "react"
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

// ─── Shared Styles ────────────────────────────────────────────────────────────

// Custom scrollbar that hides until hover/focus
const customScrollbar =
  "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 " +
  "[&::-webkit-scrollbar-track]:bg-transparent " +
  "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent " +
  "hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 " +
  "active:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 " +
  "focus-within:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20"

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
  if (type === "pdf") return <FilePdf className="size-3" />
  if (type === "img") return <ImageIcon className="size-3" />
  if (type === "xlsx") return <FileXls className="size-3" />
  return <FilePdf className="size-3" />
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
      className={`rounded border px-1 py-0.5 font-mono text-[8px] font-medium tracking-wide uppercase ${map[tag]}`}
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
    <Card className="shrink-0 rounded-xl shadow-sm">
      <CardHeader className="px-3 pt-2.5 pb-1">
        <CardTitle className="text-[11px] font-medium">
          1. Upload Files
        </CardTitle>
        <CardDescription className="text-[10px] text-muted-foreground">
          Drag and drop or browse
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-4 transition-colors ${
            isDragging
              ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30"
              : "border-border bg-card hover:border-muted-foreground/40 hover:bg-muted/20"
          }`}
        >
          <div className="flex size-6 items-center justify-center rounded-md bg-muted">
            <CloudArrowUp
              weight="light"
              className="size-3.5 text-muted-foreground"
            />
          </div>
          <div className="text-center">
            <p className="font-serif text-[11px] tracking-tight text-foreground">
              Upload files
            </p>
            <p className="mt-0.5 text-[8px] font-light tracking-wide text-muted-foreground uppercase">
              PDF · JPG · PNG · TIFF · XLSX
            </p>
          </div>
          <Input type="file" ref={fileInputRef} className="hidden" multiple />
          <Button
            variant="outline"
            className="h-5 w-20 px-2 text-[10px] font-normal"
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
    <Card className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl shadow-sm">
      <CardHeader className="shrink-0 flex-row items-center justify-between px-3 pt-2.5 pb-1.5">
        <CardTitle className="text-[11px] font-medium">
          2. Uploaded Files
        </CardTitle>
        <span className="font-mono text-[10px] text-muted-foreground">
          {files.length}
        </span>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden border-t p-0">
        <div className={`flex-1 divide-y overflow-y-auto ${customScrollbar}`}>
          {files.map((file) => (
            <button
              key={file.id}
              onClick={() => onSetActive(file.id)}
              className={`flex w-full items-center gap-1.5 px-2.5 py-1.5 text-left transition-colors hover:bg-muted/50 ${
                file.id === activeFileId ? "bg-muted/60" : ""
              }`}
            >
              <DotsSixVertical className="size-3 shrink-0 cursor-grab text-muted-foreground/40" />
              <div
                className={`flex size-4 shrink-0 items-center justify-center rounded border ${
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
                <span className="truncate text-[11px] font-normal text-foreground">
                  {file.name}
                </span>
                <span className="font-mono text-[9px] text-muted-foreground">
                  {file.range}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <TagBadge tag={file.tag} />
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(file.id)
                  }}
                  className="cursor-pointer rounded p-0.5 text-muted-foreground/40 transition-colors hover:text-foreground"
                >
                  <X className="size-2.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="shrink-0 border-t bg-muted/20 px-3 py-1.5">
          <div className="flex items-center justify-between font-mono text-[9px] text-muted-foreground">
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
    <div className="flex min-w-0 flex-1 flex-col gap-2 overflow-hidden">
      <Card className="flex h-8 shrink-0 items-center gap-2 rounded-xl px-2.5 shadow-sm">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <div className="flex size-4 shrink-0 items-center justify-center rounded border border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            <FilePdf className="size-2.5" />
          </div>
          <span className="truncate font-mono text-[10px] text-foreground">
            {activeFile?.name ?? "—"}
          </span>
        </div>
        <div className="h-3 w-px shrink-0 bg-border" />
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="outline" size="icon" className="size-4 rounded-sm">
            <CaretLeft className="size-2" />
          </Button>
          <span className="px-1 font-mono text-[10px] whitespace-nowrap text-muted-foreground">
            Page 3 of 10
          </span>
          <Button variant="outline" size="icon" className="size-4 rounded-sm">
            <CaretRight className="size-2" />
          </Button>
        </div>
        <div className="h-3 w-px shrink-0 bg-border" />
        <span className="shrink-0 pl-1 font-mono text-[10px] font-medium tracking-widest text-muted-foreground">
          BATES_0003
        </span>
      </Card>

      <div className={`flex-1 overflow-auto rounded-xl ${customScrollbar}`}>
        <div className="relative mx-auto aspect-[17/22] w-full max-w-[500px] overflow-hidden rounded-lg border bg-white font-serif text-[9px] leading-relaxed text-zinc-800 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
          <div className="absolute inset-0 overflow-hidden p-6 sm:p-8">
            <div className="space-y-3">
              <p className="text-center text-[8px] font-medium tracking-wide text-zinc-500 uppercase">
                In the United States District Court
                <br />
                for the Northern District of Example
              </p>
              <div className="mt-4 flex">
                <div className="flex-1 space-y-2">
                  <p>
                    JOHN DOE,
                    <br />
                    <span className="pl-4">Plaintiff,</span>
                  </p>
                  <p className="pl-2">v.</p>
                  <p>
                    ACME CORPORATION,
                    <br />
                    <span className="pl-4">Defendant.</span>
                  </p>
                </div>
                <div className="mx-3 w-px bg-zinc-200 dark:bg-zinc-700" />
                <div className="flex-1 space-y-2 pt-0.5">
                  <p>Case No. 1:23-cv-01234</p>
                  <p className="font-medium">DEPOSITION OF JANE SMITH</p>
                  <p>June 5, 2024</p>
                </div>
              </div>
              <div className="my-3 border-t border-zinc-200 dark:border-zinc-700" />
              <p>
                THE VIDEOGRAPHER: This is the deposition of Jane Smith taken on
                June 5, 2024, commencing at 9:02 a.m., at the offices of Legal
                Services, 123 Main Street, Example City.
              </p>
              <div className="mt-3">
                <p className="font-medium">APPEARANCES:</p>
                <div className="mt-1 space-y-1 pl-4">
                  <p>
                    For the Plaintiff:{" "}
                    <span className="pl-1.5">Mr. Alan Counsel, Esq.</span>
                  </p>
                  <p>
                    For the Defendant:{" "}
                    <span className="pl-1.5">Ms. Rebecca Advocate, Esq.</span>
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <p>THE WITNESS: My name is Jane Smith.</p>
                <p className="font-medium">BY MR. COUNSEL:</p>
                <div className="flex gap-2">
                  <span className="w-3 shrink-0">Q.</span>
                  <p>
                    Please state your current position with Acme Corporation.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="w-3 shrink-0">A.</span>
                  <p>I am the Director of Operations.</p>
                </div>
                <div className="flex gap-2">
                  <span className="w-3 shrink-0">Q.</span>
                  <p>How long have you held that position?</p>
                </div>
                <div className="flex gap-2">
                  <span className="w-3 shrink-0">A.</span>
                  <p>Since January of 2021.</p>
                </div>
                <div className="flex gap-2">
                  <span className="w-3 shrink-0">Q.</span>
                  <p>Could you describe your responsibilities in that role?</p>
                </div>
                <div className="flex gap-2">
                  <span className="w-3 shrink-0">A.</span>
                  <p>
                    I oversee day-to-day operations, manage departmental
                    budgets, and coordinate with other departments to implement
                    company initiatives.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute right-6 bottom-4 border border-zinc-200 bg-white/90 px-1.5 py-0.5 font-mono text-[8px] font-medium tracking-widest text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950/90 dark:text-zinc-200">
            PLAINTIFF_0003
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[7px] text-zinc-400">
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
    <div className="flex h-full w-[260px] shrink-0 flex-col gap-2 xl:w-[300px]">
      <Card className="shrink-0 rounded-xl shadow-sm">
        <CardHeader className="px-3 pt-2.5 pb-1.5">
          <CardTitle className="text-[11px] font-medium">
            3. Production Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-3 pb-2.5">
          <div className="flex items-center gap-2">
            <Label className="w-16 shrink-0 text-[10px] font-normal text-muted-foreground">
              Prefix
            </Label>
            <Input
              className="h-6 flex-1 font-mono text-[10px]"
              defaultValue="PLAINTIFF_"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="w-16 shrink-0 text-[10px] font-normal text-muted-foreground">
              Start Num
            </Label>
            <Input
              type="number"
              className="h-6 flex-1 font-mono text-[10px]"
              defaultValue={1}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="w-16 shrink-0 text-[10px] font-normal text-muted-foreground">
              Font Size
            </Label>
            <Input
              type="number"
              className="h-6 flex-1 font-mono text-[10px]"
              defaultValue={10}
            />
          </div>
          <div className="space-y-1.5 pt-1">
            <Label className="text-[10px] font-normal text-muted-foreground">
              Position
            </Label>
            <RadioGroup
              defaultValue="br"
              className="flex items-center justify-between rounded-md border bg-muted/20 px-2 py-1.5"
            >
              {[
                ["bl", "Left"],
                ["bc", "Center"],
                ["br", "Right"],
              ].map(([val, label]) => (
                <div key={val} className="flex items-center gap-1">
                  <RadioGroupItem value={val} id={val} className="size-2.5" />
                  <Label
                    htmlFor={val}
                    className="cursor-pointer text-[10px] font-normal"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2 border-t pt-2.5">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-normal text-muted-foreground">
                Confidentiality Notice
              </Label>
              <Switch
                checked={confidentiality}
                onCheckedChange={onConfidentialityChange}
                className="origin-right scale-[0.65]"
              />
            </div>
            {confidentiality && (
              <div className="rounded-md border border-orange-200 bg-orange-50 px-2 py-1.5 dark:border-orange-900/50 dark:bg-orange-950/20">
                <p className="font-mono text-[8px] leading-relaxed font-medium text-orange-700 dark:text-orange-400">
                  CONFIDENTIAL — SUBJECT TO PROTECTIVE ORDER
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shrink-0 rounded-xl shadow-sm">
        <CardContent className="space-y-1.5 px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              Files ready
            </span>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="size-3" weight="fill" />
              <span className="font-mono text-[10px] font-medium">
                {fileCount} / {fileCount}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              Total pages
            </span>
            <span className="font-mono text-[10px] font-medium">60</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              Bates range
            </span>
            <span className="font-mono text-[10px] font-medium">
              0001 → 0060
            </span>
          </div>
        </CardContent>
      </Card>

      <Button className="h-7 w-full shrink-0 rounded-xl text-[10px] font-medium">
        Export Production — $9
      </Button>

      <div className="flex-1" />
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FileUploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>(MOCK_FILES)
  const [activeFileId, setActiveFileId] = useState<number>(4)
  const [confidentiality, setConfidentiality] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera
      // Strict regex check for common mobile user agents
      const mobileRegex =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
      if (mobileRegex.test(userAgent)) return true

      // Catch iPads that claim to be Macs (iOS 13+ "Desktop Class Browsing")
      if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
        return true

      // Secondary check: Very small screen width combined with touch (catches extreme edge cases)
      if (
        window.matchMedia("(pointer: coarse)").matches &&
        window.innerWidth <= 768
      )
        return true

      return false
    }

    setIsMobile(checkIsMobile())

    // Optional: Re-run check on resize just in case they are devtools toggling
    const handleResize = () => setIsMobile(checkIsMobile())
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const removeFile = (id: number) =>
    setFiles((prev) => prev.filter((f) => f.id !== id))
  const activeFile = files.find((f) => f.id === activeFileId) ?? files[0]

  // Show nothing while calculating device to prevent hydration flash
  if (isMobile === null) return null

  // Block Mobile Completely
  if (isMobile) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FilePdf className="size-6" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Desktop Only
        </h2>
        <p className="mt-1.5 max-w-[250px] text-sm text-muted-foreground">
          Use a desktop computer to access this application.
        </p>
      </div>
    )
  }

  return (
    // Desktop layout (Strictly flex-row, no responsive collapsing since mobile is blocked)
    <div className="flex h-screen w-full flex-row gap-2 overflow-hidden bg-muted p-2.5 dark:bg-background">
      <div className="flex h-full w-[260px] shrink-0 flex-col gap-2 xl:w-[300px]">
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
