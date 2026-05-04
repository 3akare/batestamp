import { create } from "zustand"

export interface nFile {
  id: string
  file: File
  name: string
  size: number
  type: string
}

export interface FileStoreState {
  files: nFile[]
  addFiles: (newFiles: File[]) => void
  removeFile: (id: string) => void
  clearFiles: () => void
}

const useFileStore = create<FileStoreState>((set) => ({
  files: [],
  addFiles: (newFiles: File[]) =>
    set((state) => {
      const mappedFiles = newFiles.map((file) => {
        return {
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
        }
      })
      return { files: [...state.files, ...mappedFiles] }
    }),
  removeFile: (id: string) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    })),
  clearFiles: () => set({ files: [] }),
}))

export { useFileStore }

export const useFiles = () => useFileStore((state) => state.files)
export const useAddFiles = () => useFileStore((state) => state.addFiles)
export const useRemoveFile = () => useFileStore((state) => state.removeFile)
export const useFileCount = () => useFileStore((state) => state.files.length)
