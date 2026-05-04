import FileUploader from "@/components/file-uploader"

export default function WorkSpacePage() {
  return (
    <div className="flex min-h-screen w-full flex-row bg-muted p-4 dark:bg-background">
      <div className="flex h-full w-75 shrink-0 flex-col gap-2 xl:w-75">
        <FileUploader />
      </div>
    </div>
  )
}
