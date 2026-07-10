import Link from "next/link";
import { headers } from "next/headers";
import { QrCodeGenerator } from "@/components/admin/qr-code-generator";

async function getDefaultUrl() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function AdminQrPage() {
  const defaultUrl = await getDefaultUrl();

  return (
    <main className="flex-1 px-6 py-8">
      <Link href="/admin" className="mb-6 inline-block text-sm font-medium underline">
        Geri
      </Link>
      <h1 className="mb-6 text-xl font-semibold">QR Kodu</h1>
      <QrCodeGenerator defaultUrl={defaultUrl} />
    </main>
  );
}
