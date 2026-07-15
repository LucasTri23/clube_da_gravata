import { redirect } from 'next/navigation'
import { createClient, isAdmin } from '@/lib/supabase-server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  if (!(await isAdmin(supabase))) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 px-4 pb-6 pt-20 md:p-6">{children}</main>
    </div>
  )
}
