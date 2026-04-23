import { createAuthClient } from "better-auth/react"
import { redirect } from "react-router"

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
})

export const authLoader = async () => {
  const session = await authClient.getSession()
  if (!session.data) {
    throw redirect("/login")
  }
  return session.data
}

export const preventAuthLoader = async () => {
  const session = await authClient.getSession()
  if (session.data) {
    throw redirect("/app")
  }
  return null
}

export const handleLogout = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = "/login";
      },
    },
  });
};