import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// Get the base URL from environment or Vercel URL
const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL
  if (process.env.AUTH_URL) return process.env.AUTH_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return undefined
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects properly for deployed environment
      if (url.startsWith("/")) return `${baseUrl}${url}`
      try {
        const urlOrigin = new URL(url).origin
        if (urlOrigin === baseUrl) return url
      } catch {
        // Invalid URL, return base
      }
      return baseUrl
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
})
