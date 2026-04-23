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

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setLoading(true)
    await authClient.signUp.email(
      { email, password, name, callbackURL: "/app" },
      {
        onSuccess: () => navigate("/app"),
        onError: (ctx) => {
          setError(ctx.error.message ?? "Something went wrong.")
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
                Create your account
              </h1>
              <p className="text-[0.8rem] text-muted-foreground">
                Get started with Batestamp for free
              </p>
            </div>
          </CardHeader>

          <CardContent className="px-6 py-5">
            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-medium">
                  Full name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  autoComplete="name"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="text-xs font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="confirm-password"
                    className="text-xs font-medium"
                  >
                    Confirm
                  </label>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <p className="text-[0.75rem] text-muted-foreground">
                Must be at least 8 characters.
              </p>

              {error && <FieldError>{error}</FieldError>}

              <Button
                type="submit"
                size="lg"
                className="mt-1 w-full"
                disabled={loading}
              >
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            Sign in
          </Link>
        </p>

        <p className="text-center text-[0.72rem] text-muted-foreground/70">
          By continuing, you agree to our{" "}
          <a href="#" className="underline underline-offset-4 hover:text-muted-foreground">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-4 hover:text-muted-foreground">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}
