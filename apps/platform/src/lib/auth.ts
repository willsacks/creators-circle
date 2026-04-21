import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Resend from 'next-auth/providers/resend'
import { prisma } from '@cc/db'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM ?? 'noreply@creatorscircle.com',
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('\n🔗 Magic Link for', identifier)
          console.log(url)
          console.log()
          return
        }
        const { Resend: ResendSDK } = await import('resend')
        const resend = new ResendSDK(provider.apiKey)
        await resend.emails.send({
          from: provider.from!,
          to: identifier,
          subject: 'Sign in to Creators Circle',
          html: `
            <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="color: #1A1815; font-size: 28px; margin-bottom: 16px;">Welcome back.</h1>
              <p style="color: #4A4540; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                Click the link below to sign in to Creators Circle. This link expires in 24 hours.
              </p>
              <a href="${url}" style="display: inline-block; background: #C4892A; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-family: Inter, sans-serif; font-size: 15px; font-weight: 500;">
                Sign In →
              </a>
              <p style="color: #8A8278; font-size: 13px; margin-top: 32px;">
                If you didn't request this, you can safely ignore it.
              </p>
            </div>
          `,
        })
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt: async ({ token, user, trigger }) => {
      if (user || trigger === 'update') {
        const userId = user?.id ?? token.sub
        if (userId) {
          const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, plan: true, avatarUrl: true, name: true },
          })
          if (dbUser) {
            token.role = dbUser.role
            token.plan = dbUser.plan
            token.avatarUrl = dbUser.avatarUrl ?? undefined
            if (dbUser.name) token.name = dbUser.name
          }
        }
      }
      return token
    },
  },
})
