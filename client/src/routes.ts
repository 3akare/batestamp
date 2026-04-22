import { createBrowserRouter } from "react-router"
import Home from "./pages/(marketing)/home"
import DesignSystem from "./pages/(marketing)/design-system"

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: Home },
      {
        path: "design",
        Component: DesignSystem,
      },
    ],
  },
])
