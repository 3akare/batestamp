import { UploadSimpleIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "./ui/input"

export default function FileUpload() {
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
              <p className="mt-1 font-light tracking-wide text-muted-foreground uppercase">
                PNG, JPG, PDF up to 10MB
              </p>
            </div>
            <Button variant="default" className="px-2 py-3 text-xs">
              Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
