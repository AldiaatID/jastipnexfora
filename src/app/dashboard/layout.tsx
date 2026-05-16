import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardNav from "@/components/DashboardNav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || !user.store) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav
        storeName={user.store.name}
        username={user.store.username}
        userName={user.name}
      />
      <main className="md:ml-64">
        <div className="mx-auto max-w-6xl p-4 pb-24 md:p-8">{children}</div>
      </main>
    </div>
  );
}
