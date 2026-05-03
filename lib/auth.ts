import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

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
      // Always use relative redirects resolved against baseUrl
      // baseUrl comes from NEXTAUTH_URL or VERCEL_URL automatically
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      // Check if URL is on same origin
      try {
        const urlObj = new URL(url)
        const baseObj = new URL(baseUrl)
        if (urlObj.origin === baseObj.origin) {
          return url
        }
      } catch {
        // Invalid URL
      }
      return baseUrl
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
})
