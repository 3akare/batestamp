import { createBrowserRouter } from "react-router"
import Home from "./pages/(marketing)/home"
import DesignSystem from "./pages/(marketing)/design-system"
import { authLoader, preventAuthLoader } from "./lib/auth-client"
import Login from "./pages/(app)/(auth)/login"
import SignUp from "./pages/(app)/(auth)/signup"
import App from "./pages/(app)/app"
import NotFound from "./pages/not-found"

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login, loader: preventAuthLoader },
      { path: "signup", Component: SignUp, loader: preventAuthLoader },
      { path: "app", Component: App, loader: authLoader },
      { path: "design", Component: DesignSystem },
      { path: "*", Component: NotFound },
    ],
  },
])
