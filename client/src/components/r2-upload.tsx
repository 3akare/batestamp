import { useRef, useState } from "react"
import { SpinnerIcon, UploadSimpleIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function R2Upload() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/api/v1/get-presigned-url`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileName: file.name, fileType: file.type }),
        }
      )
      if (!response.ok) {
        throw new Error("Failed to get presigned URL")
      }
      const { url } = await response.json()
      const upload = await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      })

      if (upload.ok) {
        toast.success("Success! File is now in R2.")
      } else {
        toast.error("Failed to upload to R2.")
      }
    } catch (error) {
      toast.error(`Upload failed: ${error}`)
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted p-4 sm:p-6 lg:p-12 dark:bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-medium">File Upload</CardTitle>
          <CardDescription className="font-geist font-light text-muted-foreground">
            Drag and drop or browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-card px-3 py-6">
            <div className="flex size-8 items-center justify-center rounded-md bg-muted p-0 *:[svg]:size-4">
              <UploadSimpleIcon className="font-semibold" />
            </div>

            <div className="text-center">
              <h3 className="font-serif text-base tracking-tight text-foreground">
                Upload files
              </h3>
              <p className="mt-1 text-[10px] font-light tracking-wide text-muted-foreground uppercase">
                PNG, JPG, PDF up to 10MB
              </p>
            </div>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, application/pdf"
            />
            <Button
              variant="default"
              className="h-7 w-28 text-xs"
              onClick={handleButtonClick}
              type="button"
              disabled={loading}
            >
              {!loading ? (
                "Browse Files"
              ) : (
                <SpinnerIcon className="animate-spin" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
