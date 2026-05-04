import { useCallback, useRef, useState } from "react"
import { SpinnerIcon } from "@phosphor-icons/react"
import { CloudArrowUpIcon } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function WorkSpacePage() {
  return (
    <div className="flex min-h-screen w-full flex-row bg-muted p-4 dark:bg-background">
      <div className="flex h-full w-75 shrink-0 flex-col gap-2 xl:w-75">
        <FileUploader />
      </div>
    </div>
  )
}

function FileUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleBrowse = () => fileInputRef.current?.click()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setIsDragging(false), [])
  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setIsLoading(true)

    try {
      for (let i = 0; i < files.length; i++) {
        console.log("File detected:", files[i])
      }
    } catch (error) {
      console.log("Error processing files:", error)
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(event.target.files)
  }

  return (
    <Card className="shrink-0 rounded-md">
      <CardHeader>
        <CardTitle className="text-sm">Upload Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-4 rounded-md border border-dashed px-3 py-4 transition-colors ${
            isDragging
              ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30"
              : "border-border bg-card hover:border-muted-foreground/40 hover:bg-muted/20"
          }`}
        >
          <div className="flex size-6 items-center justify-center rounded-md bg-muted">
            <CloudArrowUpIcon
              weight="light"
              className="size-4 text-muted-foreground"
            />
          </div>
          <div className="text-center">
            <p className="font-serif text-sm tracking-tight text-foreground">
              Upload files
            </p>
            <p className="mt-0.5 text-[8px] font-light tracking-wide text-muted-foreground uppercase">
              PDF · JPG · PNG · TIFF · XLSX
            </p>
          </div>
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <Button
            variant="outline"
            className="h-7 w-28"
            type="button"
            onClick={handleBrowse}
            disabled={isLoading}
          >
            {!isLoading ? (
              "Browse Files"
            ) : (
              <SpinnerIcon className="animate-spin" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
