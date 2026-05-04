import { createBrowserRouter } from "react-router"
import Home from "./pages/(marketing)/home"
import NotFound from "./pages/not-found"
import FileUploadPage from "./pages/(marketing)/file-upload"
import FileUploadPage2 from "./pages/(workspace)/page"

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: Home },
      { path: "/file-upload", Component: FileUploadPage },
      { path: "/workspace", Component: FileUploadPage2 },
      { path: "*", Component: NotFound },
    ],
  },
])
