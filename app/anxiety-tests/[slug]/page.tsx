import { notFound } from 'next/navigation'
import { getAnxietyTestBySlug } from '@/data/anxietyTests'
import AnxietyTestRunner from '@/components/anxiety/AnxietyTestRunner'

interface PageProps {
  params: { slug: string }
}

export default function AnxietyTestDetailPage({ params }: PageProps) {
  const test = getAnxietyTestBySlug(params.slug)

  if (!test) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <section
        className="relative overflow-hidden text-white"
        style={{ backgroundImage: 'linear-gradient(120deg, rgba(5,5,5,0.85), rgba(5,5,5,0.6)), url(/assets/peaceful-meadow.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="container-custom py-16 relative z-10 space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-100">{test.subtitle}</p>
          <h1 className="text-4xl font-bold">{test.title}</h1>
          <p className="text-emerald-50/90 max-w-3xl">{test.description}</p>
          <p className="text-sm text-emerald-100/80">{test.footnote}</p>
        </div>
        <div className="absolute inset-0 bg-black/25" />
      </section>

      <section className="container-custom py-12">
        <AnxietyTestRunner test={test} />
      </section>
    </div>
  )
}

