import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Stamp } from "@phosphor-icons/react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    await authClient.signIn.email(
      { email, password, callbackURL: "/app" },
      {
        onSuccess: () => navigate("/app"),
        onError: (ctx) => {
          setError(ctx.error.message ?? "Invalid email or password.")
          setLoading(false)
        },
      }
    )
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
      {/* Subtle background gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-[360px] flex-col gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 self-center">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary shadow-sm">
            <Stamp className="size-4 text-primary-foreground" weight="bold" />
          </div>
          <span className="font-heading text-base font-semibold tracking-tight">
            Batestamp
          </span>
        </Link>

        {/* Card */}
        <Card className="gap-0 py-0 shadow-sm">
          <CardHeader className="border-b border-border/60 px-6 py-5">
            <div className="flex flex-col gap-1">
              <h1 className="font-heading text-base font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="text-[0.8rem] text-muted-foreground">
                Sign in to your Batestamp account
              </p>
            </div>
          </CardHeader>

          <CardContent className="px-6 py-5">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-medium">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-[0.75rem] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <FieldError>{error}</FieldError>}

              <Button
                type="submit"
                size="lg"
                className="mt-1 w-full"
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
