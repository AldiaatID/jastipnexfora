import { getCurrentUser } from "@/lib/auth";
import SettingsForm from "@/components/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = (await getCurrentUser())!;
  const store = user.store!;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan Toko</h1>
        <p className="text-sm text-slate-500">
          Atur identitas tokomu dan info pembayaran.
        </p>
      </div>
      <SettingsForm
        initial={{
          name: store.name,
          username: store.username,
          description: store.description,
          logoUrl: store.logoUrl,
          whatsapp: store.whatsapp,
          instagram: store.instagram,
          tiktok: store.tiktok,
          bankInfo: store.bankInfo,
        }}
      />
    </div>
  );
}
