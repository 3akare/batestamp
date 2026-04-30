import { createBrowserRouter } from "react-router"
import Home from "./pages/(marketing)/home"
import NotFound from "./pages/not-found"
import FileUploadPage from "./pages/(marketing)/file-upload"

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: Home },
      { path: "/file-upload", Component: FileUploadPage },
      { path: "*", Component: NotFound },
    ],
  },
])
