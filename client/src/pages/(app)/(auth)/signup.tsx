import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import { SpinnerIcon, EyeIcon, EyeClosedIcon } from "@phosphor-icons/react"
import GoogleIcon from "@/components/google-icon"
import MicrosoftIcon from "@/components/microsoft-icon"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

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

  const handleSocialLogin = async (provider: "google" | "microsoft") => {
    await authClient.signIn.social({
      provider,
      callbackURL: "/app",
    })
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-4 sm:p-6 lg:p-12 dark:bg-background">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="mb-1 font-heading text-3xl tracking-tight">
              Sign up
            </CardTitle>
            <CardDescription>Create an account to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel htmlFor="name" className="font-medium">
                    Name
                  </FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="email" className="font-medium">
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="doe@batestamp.xyz"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password" className="font-medium">
                    Password
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="••••••••"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>

                {error && <FieldError>{error}</FieldError>}

                <Field className="pt-1">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <SpinnerIcon className="mr-2 animate-spin" />
                        Creating account…
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </Field>

                <FieldSeparator className="my-1 *:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>

                <Field className="flex flex-row gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    size="lg"
                    className="flex-1"
                    onClick={() => handleSocialLogin("microsoft")}
                  >
                    <MicrosoftIcon />
                    Microsoft
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    size="lg"
                    className="flex-1"
                    onClick={() => handleSocialLogin("google")}
                  >
                    <GoogleIcon />
                    Google
                  </Button>
                </Field>

                <FieldDescription className="pt-1 text-center">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="underline-offset-4 hover:underline"
                  >
                    Sign in
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
