import { createBrowserRouter } from "react-router"
import Home from "./pages/(marketing)/home"
import NotFound from "./pages/not-found"

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: Home },
      { path: "*", Component: NotFound },
    ],
  },
])
