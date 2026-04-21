export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'
import { redirect, notFound } from 'next/navigation'
import { PageEditor } from '@/components/site-builder/page-editor'

export default async function PageEditorPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const page = await prisma.sitePage.findUnique({
    where: { id: params.id },
    include: { profile: true },
  })

  if (!page || page.profile.userId !== session.user.id) notFound()

  const sections = JSON.parse(page.sections || '[]')

  return (
    <div className="h-[calc(100vh-2rem)] -m-6 lg:-m-8">
      <PageEditor
        page={{
          id: page.id,
          title: page.title,
          slug: page.slug,
          published: page.published,
          sections,
          seoTitle: page.seoTitle ?? '',
          seoDescription: page.seoDescription ?? '',
        }}
        profileSlug={page.profile.slug}
      />
    </div>
  )
}
