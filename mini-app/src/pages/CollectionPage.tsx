import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

type Flavor = {
  id: string
  name: string
  description: string | null
  color_hex: string | null
  is_rare: boolean
}

export default function CollectionPage() {
  const { user } = useAuth()
  const [flavors, setFlavors] = useState<Flavor[]>([])
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: flavorData }, { data: checkinData }] = await Promise.all([
        supabase.from('flavors').select('*').eq('is_active', true).order('is_rare'),
        user
          ? supabase.from('user_flavor_checkins').select('flavor_id').eq('user_id', user.id)
          : Promise.resolve({ data: [] }),
      ])
      setFlavors(flavorData ?? [])
      setCheckedIds(new Set((checkinData ?? []).map((c: { flavor_id: string }) => c.flavor_id)))
      setLoading(false)
    }
    load()
  }, [user])

  if (loading) return <div className="flex justify-center pt-20 text-3xl">🍋</div>

  const found = flavors.filter((f) => checkedIds.has(f.id))
  const notFound = flavors.filter((f) => !checkedIds.has(f.id))

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-extrabold mb-1">Моя коллекция</h1>
      <p className="text-sm text-gray-500 mb-5">
        {found.length} из {flavors.length} вкусов открыто
      </p>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
        <div
          className="bg-lapochka-orange h-2 rounded-full transition-all"
          style={{ width: `${flavors.length ? (found.length / flavors.length) * 100 : 0}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {found.map((f) => (
          <FlavorCard key={f.id} flavor={f} found />
        ))}
        {notFound.map((f) => (
          <FlavorCard key={f.id} flavor={f} found={false} />
        ))}
      </div>
    </div>
  )
}

function FlavorCard({ flavor, found }: { flavor: Flavor; found: boolean }) {
  return (
    <div
      className={`rounded-3xl p-4 flex flex-col gap-1 ${found ? 'opacity-100' : 'opacity-40 grayscale'}`}
      style={{ backgroundColor: flavor.color_hex ?? '#F5C842' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-white/80">{flavor.is_rare ? '⭐ Редкий' : ''}</span>
        {found && <span className="text-lg">✅</span>}
      </div>
      <p className="text-white font-extrabold text-base leading-tight">{flavor.name}</p>
    </div>
  )
}
