import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' as const },
  pages: {
    signIn: '/login',
    verifyRequest: '/login?verify=1',
  },
  providers: [],
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.role = (token.role as string) ?? 'ARTIST'
        session.user.plan = (token.plan as string) ?? 'FREE'
        session.user.avatarUrl = token.avatarUrl as string | undefined
      }
      return session
    },
  },
} satisfies NextAuthConfig
