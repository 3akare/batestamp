import * as React from "react"
import { UploadSimpleIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function FileUpload() {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/get-presigned-url",
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
        console.log("Success! File is now in R2.")
      } else {
        console.error("Failed to upload to R2.")
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted p-4 sm:p-6 lg:p-12 dark:bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-medium">File Upload</CardTitle>
          <CardDescription className="font-geist font-light tracking-wide text-muted-foreground">
            Drag and drop or browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-card px-3 py-6">
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

            {/* 4. The Hidden Input */}
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" // Hides it from view but keeps it in the DOM
              accept="image/png, image/jpeg, application/pdf"
            />

            {/* 5. The Trigger Button (Maintains exact UI) */}
            <Button
              variant="default"
              className="px-2 py-3 text-xs"
              onClick={handleButtonClick}
              type="button"
            >
              Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
