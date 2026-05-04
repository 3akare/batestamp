import { createBrowserRouter } from "react-router"
import Home from "./pages/(marketing)/home"
import NotFound from "./pages/not-found"
import WorkSpacePage from "./pages/(workspace)/workspace-page"
import R2UploadPage from "./pages/(workspace)/r2-upload-page"
import HelperPage from "./pages/(workspace)/helper-page"

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: Home },
      { path: "/workspace", Component: WorkSpacePage },
      { path: "/file-upload", Component: R2UploadPage },
      { path: "/helper", Component: HelperPage },
      { path: "*", Component: NotFound },
    ],
  },
])
